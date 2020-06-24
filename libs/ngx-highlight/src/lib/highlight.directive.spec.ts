// Copyright (c) 2019-2020 The Authors.
// This file is part of @npcz/ngx-highlight.
//
// SPDX-License-Identifier: BSD-3-Clause

import { createHostFactory, SpectatorWithHost } from '@ngneat/spectator/jest';

import {
  HighlightStyle,
  HighlightStyleConfig,
  HighlightDirective,
} from './highlight.directive';
import { fakeAsync } from '@angular/core/testing';

describe('HighlightDirective ', () => {
  let host: SpectatorWithHost<HighlightDirective>;
  const createHost = createHostFactory({
    component: HighlightDirective,
    template: '<div [hcHighlight]="style">Testing HighlightDirective</div>',
  });

  const checkHoverEffectApplied = fakeAsync(
    (style: HighlightStyle, debounceTime: number) => {
      const effectClass = 'hc-hover-' + style;
      expect(host.element).not.toHaveClass(effectClass);
      host.dispatchMouseEvent(host.element, 'mouseenter');
      host.tick(debounceTime);
      expect(host.element).toHaveClass(effectClass);
      host.dispatchMouseEvent(host.element, 'mouseleave');
      host.tick(debounceTime);
      expect(host.element).not.toHaveClass(effectClass);
    }
  );
  const checkHoverEffectNotApplied = fakeAsync((debounceTime: number) => {
    host.dispatchMouseEvent(host.element, 'mouseenter');
    host.tick(debounceTime);
    expect(host.element).not.toHaveClass('hc-hover-background');
    expect(host.element).not.toHaveClass('hc-hover-shadow');
    expect(host.element).not.toHaveClass('hc-hover-outline');
  });

  const checkFocusEffectApplied = fakeAsync(
    (style: HighlightStyle, debounceTime: number) => {
      const effectClass = 'hc-focus-' + style;
      expect(host.element).not.toHaveClass(effectClass);
      host.dispatchMouseEvent(host.element, 'focusin');
      host.tick(debounceTime);
      expect(host.element).toHaveClass(effectClass);
      host.dispatchMouseEvent(host.element, 'focusout');
      host.tick(debounceTime);
      expect(host.element).not.toHaveClass(effectClass);
    }
  );
  const checkFocusEffectNotApplied = fakeAsync((debounceTime: number) => {
    host.dispatchMouseEvent(host.element, 'focusin');
    host.tick(debounceTime);
    expect(host.element).not.toHaveClass('hc-focus-background');
    expect(host.element).not.toHaveClass('hc-focus-shadow');
    expect(host.element).not.toHaveClass('hc-focus-outline');
  });

  const checkEffect = (config: HighlightStyleConfig) => {
    if (!config?.hover || config.hover == 'none') {
      checkHoverEffectNotApplied(config.debounceTime);
    } else {
      checkHoverEffectApplied(config.hover, config.debounceTime);
    }
    if (!config?.focus || config.focus == 'none') {
      checkFocusEffectNotApplied(config.debounceTime);
    } else {
      checkFocusEffectApplied(config.focus, config.debounceTime);
    }
  };

  const TEST_STYLES: HighlightStyle[] = ['background', 'shadow', 'outline'];

  it('should merge provided config with default config', () => {
    const TEST_CONFIGS: HighlightStyleConfig[] = [
      {
        hover: 'background',
        debounceTime: 100,
      },
      {
        focus: 'shadow',
        debounceTime: 200,
      },
      {
        debounceTime: 80,
      },
      {
        focus: 'outline',
        hover: 'shadow',
      },
      {
        focus: 'outline',
        hover: 'shadow',
        debounceTime: 120,
      },
      {},
    ];
    const EXPECTED_CONFIGS: HighlightStyleConfig[] = [
      {
        hover: 'background',
        focus: 'none',
        debounceTime: 100,
      },
      {
        focus: 'shadow',
        hover: 'none',
        debounceTime: 200,
      },
      {
        focus: 'none',
        hover: 'none',
        debounceTime: 80,
      },
      {
        focus: 'outline',
        hover: 'shadow',
        debounceTime: 50,
      },
      {
        focus: 'outline',
        hover: 'shadow',
        debounceTime: 120,
      },
      {
        focus: 'none',
        hover: 'none',
        debounceTime: 50,
      },
    ];

    host = createHost(undefined, {
      hostProps: {
        style: undefined,
      },
    });
    expect(host.component.highlightStyle).toEqual({
      hover: 'none',
      focus: 'none',
      debounceTime: 50,
    });
    for (const [index, config] of TEST_CONFIGS.entries()) {
      host.component.highlightStyle = config;
      expect(host.component.highlightStyle).toEqual(EXPECTED_CONFIGS[index]);
    }
  });

  describe('hover', () => {
    it('should debounce the mouse events before applying the hover style', fakeAsync(() => {
      const config = {
        hover: 'background',
        focus: 'none',
        debounceTime: 100,
      };
      host = createHost(undefined, {
        hostProps: {
          style: config,
        },
      });

      // highlight style should not be applied immediately
      host.dispatchMouseEvent(host.element, 'mouseenter');
      expect(host.element).not.toHaveClass('hc-hover-background');
      host.tick(config.debounceTime / 2);
      expect(host.element).not.toHaveClass('hc-hover-background');
      host.tick(config.debounceTime / 2);
      expect(host.element).toHaveClass('hc-hover-background');

      // highlight style should not be removed immediately
      host.dispatchMouseEvent(host.element, 'mouseleave');
      expect(host.element).toHaveClass('hc-hover-background');
      host.tick(config.debounceTime / 2);
      expect(host.element).toHaveClass('hc-hover-background');
      host.tick(config.debounceTime / 2);
      expect(host.element).not.toHaveClass('hc-hover-background');
    }));

    it('should default to none if no style is provided', () => {
      const config: HighlightStyleConfig = {
        debounceTime: 80,
      };
      host = createHost(undefined, {
        hostProps: { style: config },
      });
      checkEffect(config);
    });

    it('should use 50ms as a default debounce time if none is provided', () => {
      const config: HighlightStyleConfig = {
        hover: 'background',
      };
      host = createHost(undefined, {
        hostProps: { style: config },
      });
      checkEffect({ ...config, debounceTime: 50 });
    });

    it('should use 0ms if provided debounce time is < 0', () => {
      const config: HighlightStyleConfig = {
        hover: 'background',
        debounceTime: -10,
      };
      host = createHost(undefined, {
        hostProps: { style: config },
      });
      checkEffect({ ...config, debounceTime: 0 });
    });

    it('should not apply the effect if the style is none', () => {
      const config: HighlightStyleConfig = {
        hover: 'none',
        debounceTime: 80,
      };
      host = createHost(undefined, {
        hostProps: { style: config },
      });
      checkEffect(config);
    });

    for (const value of TEST_STYLES) {
      it('should add correct class on mousein and remove it on mouseout ', () => {
        const config: HighlightStyleConfig = {
          hover: value,
          debounceTime: 80,
        };
        host = createHost(undefined, {
          hostProps: { style: config },
        });
        checkEffect(config);
      });
    }

    it('should implement hover style change after component initialization', () => {
      const config: HighlightStyleConfig = {
        hover: 'background',
        debounceTime: 80,
      };
      host = createHost(undefined, {
        hostProps: { style: config },
      });

      checkEffect(config);

      config.hover = 'none';
      host.component.highlightStyle = config;
      checkEffect(config);

      config.hover = 'shadow';
      host.component.highlightStyle = config;
      checkEffect(config);
    });
  });

  describe('focus', () => {
    it('should debounce the focus events before applying the hover style', fakeAsync(() => {
      const config = {
        hover: 'none',
        focus: 'background',
        debounceTime: 100,
      };
      host = createHost(undefined, {
        hostProps: {
          style: config,
        },
      });

      // highlight style should not be applied immediately
      host.dispatchMouseEvent(host.element, 'focusin');
      expect(host.element).not.toHaveClass('hc-focus-background');
      host.tick(config.debounceTime / 2);
      expect(host.element).not.toHaveClass('hc-focus-background');
      host.tick(config.debounceTime / 2);
      expect(host.element).toHaveClass('hc-focus-background');

      // highlight style should not be removed immediately
      host.dispatchMouseEvent(host.element, 'focusout');
      expect(host.element).toHaveClass('hc-focus-background');
      host.tick(config.debounceTime / 2);
      expect(host.element).toHaveClass('hc-focus-background');
      host.tick(config.debounceTime / 2);
      expect(host.element).not.toHaveClass('hc-focus-background');
    }));

    it('should default to none if no style is provided', () => {
      const config: HighlightStyleConfig = {
        debounceTime: 80,
      };
      host = createHost(undefined, {
        hostProps: { style: config },
      });
      checkEffect(config);
    });

    it('should use 50ms as a default debounce time if none is provided', () => {
      const config: HighlightStyleConfig = {
        focus: 'background',
      };
      host = createHost(undefined, {
        hostProps: { style: config },
      });
      checkEffect({ ...config, debounceTime: 50 });
    });

    it('should not apply the effect if the style is none', () => {
      const config: HighlightStyleConfig = {
        focus: 'none',
        debounceTime: 80,
      };
      host = createHost(undefined, {
        hostProps: { style: config },
      });
      checkEffect(config);
    });

    for (const value of TEST_STYLES) {
      it('should add correct class on focusin and remove it on focusout ', () => {
        const config: HighlightStyleConfig = {
          focus: value,
          debounceTime: 80,
        };
        host = createHost(undefined, {
          hostProps: { style: config },
        });
        checkEffect(config);
      });
    }

    it('should remove hover effect when focus is applied and restore it when focus is lost', fakeAsync(() => {
      const config: HighlightStyleConfig = {
        hover: 'background',
        focus: 'outline',
        debounceTime: 80,
      };
      host = createHost(undefined, {
        hostProps: { style: config },
      });

      const hoverClass = 'hc-hover-background';
      const focusClass = 'hc-focus-outline';
      host.dispatchMouseEvent(host.element, 'mouseenter');
      host.tick(config.debounceTime);
      expect(host.element).toHaveClass(hoverClass);
      host.dispatchMouseEvent(host.element, 'focusin');
      host.tick(config.debounceTime);
      expect(host.element).toHaveClass(focusClass);
      expect(host.element).not.toHaveClass(hoverClass);

      // Focus out should restore the hover
      host.dispatchMouseEvent(host.element, 'focusout');
      host.tick(config.debounceTime);
      expect(host.element).not.toHaveClass(focusClass);
      expect(host.element).toHaveClass(hoverClass);
    }));

    it('should implement focus style change after component initialization', () => {
      const config: HighlightStyleConfig = {
        focus: 'background',
        debounceTime: 80,
      };
      host = createHost(undefined, {
        hostProps: { style: config },
      });

      checkEffect(config);

      config.focus = 'none';
      host.component.highlightStyle = config;
      checkEffect(config);

      config.focus = 'outline';
      host.component.highlightStyle = config;
      checkEffect(config);
    });
  });
});
