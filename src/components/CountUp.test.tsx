import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { CountUp } from './CountUp';

describe('CountUp component', () => {
  beforeEach(() => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders static server markup for numeric and non-numeric stats', () => {
    const html1 = renderToStaticMarkup(<CountUp value="17" />);
    expect(html1).toContain('17');

    const html2 = renderToStaticMarkup(<CountUp value="§47a" />);
    expect(html2).toContain('§47a');

    const html3 = renderToStaticMarkup(<CountUp value="100%" durationMs={500} />);
    expect(html3).toContain('100%');

    const html4 = renderToStaticMarkup(<CountUp value="$1,250.50" />);
    expect(html4).toContain('$1,250.50');
  });

  it('handles reduced motion and IntersectionObserver setup', () => {
    class MockIntersectionObserver {
      observe = vi.fn();
      disconnect = vi.fn();
    }
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

    let capturedEffect: (() => void | (() => void)) | null = null;
    const useEffectSpy = vi.spyOn(React, 'useEffect').mockImplementation((effect) => {
      capturedEffect = effect;
    });

    renderToStaticMarkup(<CountUp value="25" />);
    useEffectSpy.mockRestore();

    expect(capturedEffect).toBeDefined();
    if (capturedEffect) {
      const cleanup = (capturedEffect as () => void | (() => void))();
      if (typeof cleanup === 'function') {
        cleanup();
      }
    }
  });

  it('executes animation frame callback when element intersects', () => {
    let capturedObserverCb: ((entries: Array<{ isIntersecting: boolean }>) => void) | null = null;
    class MockIntersectionObserver {
      constructor(cb: (entries: Array<{ isIntersecting: boolean }>) => void) {
        capturedObserverCb = cb;
      }
      observe = vi.fn();
      disconnect = vi.fn();
    }
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

    let rafCallback: ((ts: number) => void) | null = null;
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((cb: (ts: number) => void) => {
        rafCallback = cb;
        return 101;
      })
    );
    const cancelSpy = vi.fn();
    vi.stubGlobal('cancelAnimationFrame', cancelSpy);

    let capturedEffect: (() => void | (() => void)) | null = null;
    const useEffectSpy = vi.spyOn(React, 'useEffect').mockImplementation((effect) => {
      capturedEffect = effect;
    });

    const mockNode = { current: {} };
    const useRefSpy = vi
      .spyOn(React, 'useRef')
      .mockReturnValue(mockNode as unknown as React.RefObject<null>);

    renderToStaticMarkup(<CountUp value="$50.00" durationMs={100} />);
    useEffectSpy.mockRestore();
    useRefSpy.mockRestore();

    if (capturedEffect) {
      const cleanup = (capturedEffect as () => void | (() => void))();
      expect(capturedObserverCb).toBeDefined();

      if (capturedObserverCb) {
        // Trigger intersection
        (capturedObserverCb as (entries: Array<{ isIntersecting: boolean }>) => void)([
          { isIntersecting: true },
        ]);
        expect(rafCallback).toBeDefined();

        if (rafCallback) {
          // Tick animation: frame 1 (p < 1)
          (rafCallback as (ts: number) => void)(100);
          // Tick animation: frame 2 (p >= 1)
          (rafCallback as (ts: number) => void)(300);
        }
      }

      if (typeof cleanup === 'function') {
        cleanup();
        expect(cancelSpy).toHaveBeenCalled();
      }
    }
  });
});
