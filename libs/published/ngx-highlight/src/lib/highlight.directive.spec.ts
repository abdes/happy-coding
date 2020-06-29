// Copyright (c) 2019-2020 The Authors
// This file is part of @npcz/ngx-highlight
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { createHostFactory, SpectatorWithHost } from '@ngneat/spectator/jest';

import {
  DEFAULT_DEBOUNCE_TIME,
  DEFAULT_STYLE_CONFIG,
  HighlightStyle,
  HighlightStyleConfig,
  HighlightDirective,
} from './highlight.directive';
import { fakeAsync } from '@angular/core/testing';

describe('HighlightDirective', () => {
  let host: SpectatorWithHost<HighlightDirective>;

  //
  // Test helpers
  //

  const TEST_STYLES: HighlightStyle[] = ['background', 'shadow', 'outline'];

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
    (style: HighlightStyle, debounceTime?: number) => {
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
  const checkFocusEffectNotApplied = fakeAsync((debounceTime?: number) => {
    host.dispatchMouseEvent(host.element, 'focusin');
    host.tick(debounceTime);
    expect(host.element).not.toHaveClass('hc-focus-background');
    expect(host.element).not.toHaveClass('hc-focus-shadow');
    expect(host.element).not.toHaveClass('hc-focus-outline');
  });

  const checkEffect = (config: HighlightStyleConfig, debounceTime?: number) => {
    const debounceTimeToUse = debounceTime
      ? debounceTime
      : host.component.hcHighlightDebounce;

    if (!config?.hover || config.hover == 'none') {
      checkHoverEffectNotApplied(debounceTimeToUse);
    } else {
      checkHoverEffectApplied(config.hover, debounceTimeToUse);
    }
    if (!config?.focus || config.focus == 'none') {
      checkFocusEffectNotApplied(debounceTimeToUse);
    } else {
      checkFocusEffectApplied(config.focus, debounceTimeToUse);
    }
  };

  describe('defaults', () => {
    const createHost = createHostFactory({
      component: HighlightDirective,
      template: '<div hcHighlight>Testing HighlightDirective</div>',
    });

    it('should use default debounce time and default styles when none are provided', () => {
      host = createHost();
      expect(host.component.hcHighlightDebounce).toEqual(DEFAULT_DEBOUNCE_TIME);
      expect(host.component.highlightStyle).toEqual(DEFAULT_STYLE_CONFIG);
      checkEffect(DEFAULT_STYLE_CONFIG, DEFAULT_DEBOUNCE_TIME);
    });
  });

  describe('custom styles', () => {
    const createHost = createHostFactory({
      component: HighlightDirective,
      template: '<div [hcHighlight]="style">Testing HighlightDirective</div>',
    });

    it('should merge provided styles with default styles', () => {
      const TEST_CONFIGS: HighlightStyleConfig[] = [
        {
          hover: 'background',
        },
        {
          focus: 'shadow',
        },
        {
          focus: 'outline',
          hover: 'shadow',
        },
        {
          focus: 'none',
          hover: 'shadow',
        },
        {},
      ];
      const EXPECTED_CONFIGS: HighlightStyleConfig[] = [
        {
          hover: 'background',
          focus: 'none',
        },
        {
          focus: 'shadow',
          hover: 'none',
        },
        {
          focus: 'outline',
          hover: 'shadow',
        },
        {
          focus: 'none',
          hover: 'shadow',
        },
        {
          focus: 'none',
          hover: 'none',
        },
      ];

      host = createHost(undefined, {
        hostProps: {
          style: undefined,
        },
      });
      expect(host.component.highlightStyle).toEqual(DEFAULT_STYLE_CONFIG);
      for (const [index, config] of TEST_CONFIGS.entries()) {
        host.component.highlightStyle = config;
        expect(host.component.highlightStyle).toEqual(EXPECTED_CONFIGS[index]);
      }
    });

    describe('hover', () => {
      it('should debounce the mouse events before applying the hover style', fakeAsync(() => {
        const config: HighlightStyleConfig = {
          hover: 'background',
          focus: 'none',
        };
        host = createHost(undefined, {
          hostProps: {
            style: config,
          },
        });

        // highlight style should not be applied immediately
        host.dispatchMouseEvent(host.element, 'mouseenter');
        expect(host.element).not.toHaveClass('hc-hover-background');
        host.tick(host.component.hcHighlightDebounce / 2);
        expect(host.element).not.toHaveClass('hc-hover-background');
        host.tick(host.component.hcHighlightDebounce / 2);
        expect(host.element).toHaveClass('hc-hover-background');

        // highlight style should not be removed immediately
        host.dispatchMouseEvent(host.element, 'mouseleave');
        expect(host.element).toHaveClass('hc-hover-background');
        host.tick(host.component.hcHighlightDebounce / 2);
        expect(host.element).toHaveClass('hc-hover-background');
        host.tick(host.component.hcHighlightDebounce / 2);
        expect(host.element).not.toHaveClass('hc-hover-background');
      }));

      it('should not apply the effect if the style is none', () => {
        const config: HighlightStyleConfig = {
          hover: 'none',
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
          };
          host = createHost(undefined, {
            hostProps: { style: config },
          });
          checkEffect(config);
        });
      }

      describe('style update', () => {
        it('should update the hover class when component is hovered only', fakeAsync(() => {
          const config: HighlightStyleConfig = {
            hover: 'background',
          };
          host = createHost(undefined, {
            hostProps: { style: config },
          });

          // hover the element and check the style was added
          host.dispatchMouseEvent(host.element, 'mouseenter');
          host.tick(host.component.hcHighlightDebounce);
          expect(host.element).toHaveClass('hc-hover-background');

          // Now we change the effect style without the mouse leaving
          // and check that the class changes as well
          host.component.highlightStyle = { hover: 'shadow' };
          host.tick(host.component.hcHighlightDebounce);
          expect(host.element).not.toHaveClass('hc-hover-background');
          expect(host.element).toHaveClass('hc-hover-shadow');

          // set hover to none and expect no hover classes are added
          host.component.highlightStyle = { hover: 'none' };
          host.tick(host.component.hcHighlightDebounce);
          for (const style of TEST_STYLES) {
            expect(host.element).not.toHaveClass(`hc-hover-${style}`);
          }
        }));

        it('should not add a hover class when component not hovered', fakeAsync(() => {
          const config: HighlightStyleConfig = {
            hover: 'background',
          };
          host = createHost(undefined, {
            hostProps: { style: config },
          });

          for (const style of TEST_STYLES) {
            expect(host.element).not.toHaveClass(`hc-hover-${style}`);
          }

          // Now we change the effect style without the mouse enetering
          // and check that the class is not added
          host.component.highlightStyle = { hover: 'shadow' };
          host.tick(host.component.hcHighlightDebounce);
          for (const style of TEST_STYLES) {
            expect(host.element).not.toHaveClass(`hc-hover-${style}`);
          }
        }));

        it('should not add a hover class when component is focused with a style', fakeAsync(() => {
          const config: HighlightStyleConfig = {
            hover: 'background',
            focus: 'outline',
          };
          host = createHost(undefined, {
            hostProps: { style: config },
          });

          // hover the element and check the style was added
          host.dispatchMouseEvent(host.element, 'mouseenter');
          host.dispatchMouseEvent(host.element, 'focusin');
          host.tick(host.component.hcHighlightDebounce);
          expect(host.element).toHaveClass('hc-focus-outline');
          for (const style of TEST_STYLES) {
            expect(host.element).not.toHaveClass(`hc-hover-${style}`);
          }

          // Now we change the effect style without the mouse leaving
          // and check that the class changes as well
          host.component.highlightStyle = { hover: 'shadow', focus: 'outline' };
          host.tick(host.component.hcHighlightDebounce);
          for (const style of TEST_STYLES) {
            expect(host.element).not.toHaveClass(`hc-hover-${style}`);
          }
        }));
      });
    });

    describe('focus', () => {
      it('should debounce the focus events before applying the hover style', fakeAsync(() => {
        const config: HighlightStyleConfig = {
          hover: 'none',
          focus: 'background',
        };
        host = createHost(undefined, {
          hostProps: {
            style: config,
          },
        });

        // highlight style should not be applied immediately
        host.dispatchMouseEvent(host.element, 'focusin');
        expect(host.element).not.toHaveClass('hc-focus-background');
        host.tick(host.component.hcHighlightDebounce / 2);
        expect(host.element).not.toHaveClass('hc-focus-background');
        host.tick(host.component.hcHighlightDebounce / 2);
        expect(host.element).toHaveClass('hc-focus-background');

        // highlight style should not be removed immediately
        host.dispatchMouseEvent(host.element, 'focusout');
        expect(host.element).toHaveClass('hc-focus-background');
        host.tick(host.component.hcHighlightDebounce / 2);
        expect(host.element).toHaveClass('hc-focus-background');
        host.tick(host.component.hcHighlightDebounce / 2);
        expect(host.element).not.toHaveClass('hc-focus-background');
      }));

      it('should not apply the effect if the style is none', () => {
        const config: HighlightStyleConfig = {
          focus: 'none',
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
        };
        host = createHost(undefined, {
          hostProps: { style: config },
        });

        const hoverClass = 'hc-hover-background';
        const focusClass = 'hc-focus-outline';
        host.dispatchMouseEvent(host.element, 'mouseenter');
        host.tick(host.component.hcHighlightDebounce);
        expect(host.element).toHaveClass(hoverClass);
        host.dispatchMouseEvent(host.element, 'focusin');
        host.tick(host.component.hcHighlightDebounce);
        expect(host.element).toHaveClass(focusClass);
        expect(host.element).not.toHaveClass(hoverClass);

        // Focus out should restore the hover
        host.dispatchMouseEvent(host.element, 'focusout');
        host.tick(host.component.hcHighlightDebounce);
        expect(host.element).not.toHaveClass(focusClass);
        expect(host.element).toHaveClass(hoverClass);
      }));

      describe('style update', () => {
        it('should update the focus class when component is focused', fakeAsync(() => {
          const config: HighlightStyleConfig = {
            focus: 'background',
          };
          host = createHost(undefined, {
            hostProps: { style: config },
          });

          // hover the element and check the style was added
          host.dispatchMouseEvent(host.element, 'focusin');
          host.tick(host.component.hcHighlightDebounce);
          expect(host.element).toHaveClass('hc-focus-background');

          // Now we change the effect style without the focus leaving
          // and check that the class changes as well
          host.component.highlightStyle = { focus: 'outline' };
          host.tick(host.component.hcHighlightDebounce);
          expect(host.element).toHaveClass('hc-focus-outline');

          // set focus to none and expect no focus classes are added
          host.component.highlightStyle = { focus: 'none' };
          host.tick(host.component.hcHighlightDebounce);
          for (const style of TEST_STYLES) {
            expect(host.element).not.toHaveClass(`hc-focus-${style}`);
          }
        }));

        it('should not add a focus class when component not focused', fakeAsync(() => {
          const config: HighlightStyleConfig = {
            focus: 'background',
          };
          host = createHost(undefined, {
            hostProps: { style: config },
          });

          for (const style of TEST_STYLES) {
            expect(host.element).not.toHaveClass(`hc-focus-${style}`);
          }

          // Now we change the effect style without the focus in
          // and check that the class is not added
          host.component.highlightStyle = { focus: 'shadow' };
          host.tick(host.component.hcHighlightDebounce);
          for (const style of TEST_STYLES) {
            expect(host.element).not.toHaveClass(`hc-focus-${style}`);
          }
        }));
      });
    });
  });

  describe('custom debounce time', () => {
    const createHost = createHostFactory({
      component: HighlightDirective,
      template:
        '<div [hcHighlight]="style" [hcHighlightDebounce]="debounceTime">Testing HighlightDirective</div>',
    });

    it('should use default if debounce time is undefined', () => {
      const config: HighlightStyleConfig = {
        hover: 'background',
        focus: 'outline',
      };
      const debounceTime = undefined;
      host = createHost(undefined, {
        hostProps: { style: config, debounceTime: debounceTime },
      });
      checkEffect(config, DEFAULT_DEBOUNCE_TIME);
    });

    it('should use 0ms if provided debounce time is < 0', () => {
      const config: HighlightStyleConfig = {
        hover: 'background',
      };
      const debounceTime = -10;
      host = createHost(undefined, {
        hostProps: { style: config, debounceTime: debounceTime },
      });
      checkEffect(config, 0);
    });

    const TEST_CONFIGS: HighlightStyleConfig[] = [
      {
        hover: 'shadow',
      },
      {
        focus: 'background',
      },
      {
        focus: 'outline',
        hover: 'shadow',
      },
      {
        focus: 'none',
        hover: 'none',
      },
      {},
    ];

    for (const scenario of TEST_CONFIGS) {
      it('should use provided debounce time if valid', () => {
        const debounceTime = 80;
        host = createHost(undefined, {
          hostProps: { style: scenario, debounceTime: debounceTime },
        });
        checkEffect(scenario, debounceTime);
      });
    }

    it('should implement debounceTime change after component initialization', () => {
      const config: HighlightStyleConfig = {
        hover: 'background',
        focus: 'outline',
      };
      const debounceTime = 80;
      host = createHost(undefined, {
        hostProps: { style: config, debounceTime: debounceTime },
      });
      checkEffect(config, debounceTime);

      host.component.hcHighlightDebounce = debounceTime / 2;
      checkEffect(config, debounceTime / 2);
    });
  });
});
