import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { InviteForm } from './InviteForm';
import { makeSubmitEvent } from '@/test-utils/fixtures';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
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

type FormTree = React.ReactElement<{
  onSubmit: (e: React.FormEvent) => void;
  children: Array<
    React.ReactElement<{
      id?: string;
      name?: string;
      onChange: (e: { target: { value: string } }) => void;
    }>
  >;
}>;

describe('InviteForm component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    stateValues = [];
    stateIndex = 0;
  });

  it('renders static form markup with honeypot and submit button', () => {
    const html = renderToStaticMarkup(<InviteForm className="custom-form-class" />);
    expect(html).toContain('custom-form-class');
    expect(html).toContain('name="company"');
    expect(html).toContain('placeholder="you@wesleyan.edu"');
    expect(html).toContain('Get an invite');
  });

  it('handles form submission with empty email and navigates to /login', () => {
    stateIndex = 0;
    stateValues = ['', '']; // email='', company=''
    const tree = InviteForm({}) as FormTree;

    const preventDefault = vi.fn();
    tree.props.onSubmit(makeSubmitEvent(preventDefault) as React.FormEvent);

    expect(preventDefault).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('handles form submission with filled email, triggers fetch and navigation', () => {
    stateIndex = 0;
    stateValues = ['renter@wesleyan.edu', 'HoneypotCo'];
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', mockFetch);

    const tree = InviteForm({}) as FormTree;

    // Find and exercise onChange handlers
    const inputs = tree.props.children.filter((c) => c && c.props && (c.props.id || c.props.name));
    const companyInput = inputs.find((i) => i.props.name === 'company');
    const emailInput = inputs.find((i) => i.props.id === 'invite-email');

    companyInput?.props.onChange({ target: { value: 'HoneypotCo' } });
    emailInput?.props.onChange({ target: { value: 'renter@wesleyan.edu' } });

    const preventDefault = vi.fn();
    tree.props.onSubmit(makeSubmitEvent(preventDefault) as React.FormEvent);

    expect(preventDefault).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledWith(
      '/invite-request',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'renter@wesleyan.edu', company: 'HoneypotCo' }),
        keepalive: true,
      })
    );
    expect(mockPush).toHaveBeenCalledWith('/login?email=renter%40wesleyan.edu');
  });

  it('catches and ignores fetch error on submit gracefully', () => {
    stateIndex = 0;
    stateValues = ['error@example.com', ''];
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    const tree = InviteForm({}) as FormTree;
    expect(() => {
      tree.props.onSubmit(makeSubmitEvent(vi.fn()) as React.FormEvent);
    }).not.toThrow();
  });
});
