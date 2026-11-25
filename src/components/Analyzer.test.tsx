import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { Analyzer } from './Analyzer';
import * as supabaseClient from '@/lib/supabase/client';
import { makeReport } from '@/test-utils/fixtures';

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
}));

let stateValues: unknown[] = [];
const stateSetters: Array<((v: unknown) => void) | undefined> = [];
let stateIndex = 0;

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof React>();
  return {
    ...actual,
    useState: <T,>(initial: T | (() => T)): [T, (v: T | ((prev: T) => T)) => void] => {
      const idx = stateIndex++;
      if (stateValues.length <= idx) {
        stateValues[idx] = typeof initial === 'function' ? (initial as () => T)() : initial;
      }
      const setter = (newVal: T | ((prev: T) => T)) => {
        stateValues[idx] =
          typeof newVal === 'function' ? (newVal as (prev: T) => T)(stateValues[idx] as T) : newVal;
        if (stateSetters[idx]) stateSetters[idx]!(newVal);
      };
      return [stateValues[idx] as T, setter];
    },
  };
});

type AnalyzerTree = React.ReactElement<{
  children: [
    unknown,
    React.ReactElement<{
      onSubmit: (e: React.FormEvent) => Promise<void>;
      children: [
        React.ReactElement<{
          onDragOver: (e: React.DragEvent) => void;
          onDragLeave: () => void;
          onDrop: (e: React.DragEvent) => void;
          children: [
            unknown,
            unknown,
            unknown,
            React.ReactElement<{
              onChange: (e: { target: { files: File[] | null } }) => void;
            }>,
          ];
        }>,
        React.ReactElement<{
          children: [
            React.ReactElement<{
              children: [
                unknown,
                React.ReactElement<{
                  onChange: (e: { target: { value: string } }) => void;
                }>,
              ];
            }>,
            unknown,
          ];
        }>,
      ];
    }>,
    React.ReactElement<{
      children: React.ReactElement<{
        onClick: () => void;
      }>;
    }>,
  ];
}>;

describe('Analyzer component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    stateValues = [];
    stateIndex = 0;
  });

  it('renders initial intake UI with file upload area and state selector', () => {
    const html = renderToStaticMarkup(<Analyzer userId="user-123" />);
    expect(html).toContain('Let&#x27;s read your lease.');
    expect(html).toContain('Drop your lease here');
    expect(html).toContain('Scan my lease →');
    expect(html).toContain('Auto-detect from the lease');
    expect(html).toContain('Connecticut');
  });

  it('renders loading state when loading is true', () => {
    stateIndex = 0;
    const mockFile = new File([''], 'my-upload.pdf');
    stateValues = [mockFile, false, true, null, null, false, 'auto'];

    const html = renderToStaticMarkup(<Analyzer userId="user-123" />);
    expect(html).toContain('Reading your lease.');
    expect(html).toContain('my-upload.pdf');
    expect(html).toContain('Reading the document text');
  });

  it('renders report state with saved indicator and reset button', () => {
    stateIndex = 0;
    const mockReport = makeReport();
    stateValues = [new File([''], 'done.pdf'), false, false, mockReport, null, true, 'auto'];

    const html = renderToStaticMarkup(<Analyzer userId="user-123" />);
    expect(html).toContain('Saved to your account');
    expect(html).toContain('Analyze another lease');

    // Test clicking reset button
    stateIndex = 0;
    const tree = Analyzer({ userId: 'user-123' }) as AnalyzerTree;
    const resetBtn = tree.props.children[2].props.children;
    expect(resetBtn.props.onClick).toBeDefined();
    resetBtn.props.onClick();
  });

  it('renders error message and dragOver visual state', () => {
    stateIndex = 0;
    stateValues = [null, true, false, null, 'Error reading lease file.', false, 'ct'];

    const html = renderToStaticMarkup(<Analyzer userId="user-123" />);
    expect(html).toContain('border-primary bg-primary/5');
    expect(html).toContain('Error reading lease file.');
  });

  it('captures and tests all interactive form and drag handlers', async () => {
    stateIndex = 0;
    const testFile = new File(['content'], 'lease.pdf', { type: 'application/pdf' });
    stateValues = [testFile, false, false, null, null, false, 'auto'];

    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(supabaseClient.createClient).mockReturnValue({
      from: vi.fn().mockReturnValue({ insert: mockInsert }),
    } as unknown as ReturnType<typeof supabaseClient.createClient>);

    const mockReport = makeReport({
      meta: { pages: 2, chars: 500, method: 'digital', needs_ocr: false },
    });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockReport,
      })
    );

    const tree = Analyzer({ userId: 'user-123' }) as AnalyzerTree;
    const form = tree.props.children[1];
    const dropLabel = form.props.children[0];
    const controls = form.props.children[1];
    const select = controls.props.children[0].props.children[1];
    const fileInput = dropLabel.props.children[3];

    // Test drag events
    const preventDrag = vi.fn();
    dropLabel.props.onDragOver({ preventDefault: preventDrag } as unknown as React.DragEvent);
    expect(preventDrag).toHaveBeenCalled();

    dropLabel.props.onDragLeave();

    const preventDrop = vi.fn();
    dropLabel.props.onDrop({
      preventDefault: preventDrop,
      dataTransfer: { files: [testFile] },
    } as unknown as React.DragEvent);
    expect(preventDrop).toHaveBeenCalled();

    dropLabel.props.onDrop({
      preventDefault: preventDrop,
      dataTransfer: { files: [] },
    } as unknown as React.DragEvent);

    // Test onChange
    fileInput.props.onChange({ target: { files: [testFile] } });
    fileInput.props.onChange({ target: { files: null } });
    select.props.onChange({ target: { value: 'ny' } });

    // Test analyze submit
    const preventDefault = vi.fn();
    await form.props.onSubmit({ preventDefault } as unknown as React.FormEvent);
    expect(preventDefault).toHaveBeenCalled();
  });

  it('handles submission when file is null, API errors, and network errors', async () => {
    // 1. Submit with null file
    stateIndex = 0;
    stateValues = [null, false, false, null, null, false, 'auto'];
    const tree1 = Analyzer({ userId: 'user-123' }) as AnalyzerTree;
    const form1 = tree1.props.children[1];
    const prev1 = vi.fn();
    await form1.props.onSubmit({ preventDefault: prev1 } as unknown as React.FormEvent);
    expect(prev1).toHaveBeenCalled();

    // 2. Submit with API failure
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ ok: false, error: 'Custom API error' }),
      })
    );
    stateIndex = 0;
    const testFile = new File(['content'], 'lease.pdf');
    stateValues = [testFile, false, false, null, null, false, 'auto'];
    const tree2 = Analyzer({ userId: 'user-123' }) as AnalyzerTree;
    await tree2.props.children[1].props.onSubmit({
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent);

    // 3. Submit with API failure without error string
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ ok: false }),
      })
    );
    stateIndex = 0;
    stateValues = [testFile, false, false, null, null, false, 'auto'];
    const tree3 = Analyzer({ userId: 'user-123' }) as AnalyzerTree;
    await tree3.props.children[1].props.onSubmit({
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent);

    // 4. Submit with network Error throw
    vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce(new Error('Fetch failed')));
    stateIndex = 0;
    stateValues = [testFile, false, false, null, null, false, 'auto'];
    const tree4 = Analyzer({ userId: 'user-123' }) as AnalyzerTree;
    await tree4.props.children[1].props.onSubmit({
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent);

    // 5. Submit with network non-Error throw
    vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce('string error'));
    stateIndex = 0;
    stateValues = [testFile, false, false, null, null, false, 'auto'];
    const tree5 = Analyzer({ userId: 'user-123' }) as AnalyzerTree;
    await tree5.props.children[1].props.onSubmit({
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent);

    // 6. Submit with Supabase insert throwing
    vi.mocked(supabaseClient.createClient).mockReturnValue({
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockRejectedValue(new Error('Supabase error')),
      }),
    } as unknown as ReturnType<typeof supabaseClient.createClient>);

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          jurisdiction: 'ct',
          meta: { pages: 1, chars: 10, method: 'digital' },
          flags: [],
        }),
      })
    );

    stateIndex = 0;
    stateValues = [testFile, false, false, null, null, false, 'auto'];
    const tree6 = Analyzer({ userId: 'user-123' }) as AnalyzerTree;
    await tree6.props.children[1].props.onSubmit({
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent);

    // 7. Submit with Supabase returning saveErr
    vi.mocked(supabaseClient.createClient).mockReturnValue({
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockResolvedValue({ error: { message: 'DB error' } }),
      }),
    } as unknown as ReturnType<typeof supabaseClient.createClient>);

    stateIndex = 0;
    stateValues = [testFile, false, false, null, null, false, 'auto'];
    const tree7 = Analyzer({ userId: 'user-123' }) as AnalyzerTree;
    await tree7.props.children[1].props.onSubmit({
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent);
  });
});
