import { injectStyles } from "./index";

export { injectStyles };

export interface AnchorPositionOptions {
    namespace: string;
    baseStyles?: string;
}

export function generateAnchorCSS(options: AnchorPositionOptions): string {
    const { namespace, baseStyles = "" } = options;
    const popoverAttr = `data-${namespace}-popover`;
    const placementAttr = `data-${namespace}-placement`;
    const anchorVar = `--${namespace}-anchor-name`;

    return `
/* Fallback for browsers that don't support anchor positioning */
[${popoverAttr}] {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
    ${
        namespace === "dropdown"
            ? `
    top: 50%;
    bottom: auto;
    transform: translate(-50%, -50%);
    `
            : namespace === "tooltip"
              ? `
    top: auto;
    bottom: 24px;
    `
              : `
    top: 50%;
    transform: translate(-50%, -50%);
    `
    }
    ${baseStyles}
}

@supports (position-anchor: --foo) {
    /* Define try options for flipping */
    @position-try --flip-top-to-bottom {
        bottom: auto;
        top: anchor(bottom);
        margin-bottom: 0;
        margin-top: 8px;
    }

    @position-try --flip-bottom-to-top {
        top: auto;
        bottom: anchor(top);
        margin-top: 0;
        margin-bottom: 8px;
    }

    @position-try --flip-left-to-right {
        right: auto;
        left: anchor(right);
        margin-right: 0;
        margin-left: 8px;
    }

    @position-try --flip-right-to-left {
        left: auto;
        right: anchor(left);
        margin-left: 0;
        margin-right: 8px;
    }

    /* Combined flip for corner cases (e.g. top-right placement) */
    @position-try --flip-top-right {
        bottom: auto;
        left: auto;
        top: anchor(bottom);
        right: anchor(right);
        margin-bottom: 0;
        margin-top: 8px;
    }

    [${popoverAttr}] {
        position: fixed;
        transform: none;
        inset: auto;
        margin: 0;

        position-anchor: var(${anchorVar});
        position-visibility: anchors-visible;
    }

    /* Top Placement */
    [${placementAttr}="top"][${popoverAttr}] {
        bottom: anchor(top);
        left: anchor(center);
        translate: -50% 0;
        margin-bottom: 8px;
        position-try-fallbacks: --flip-top-to-bottom;
    }

    [${placementAttr}="top-start"][${popoverAttr}] {
        bottom: anchor(top);
        left: anchor(left);
        margin-bottom: 8px;
        position-try-fallbacks: --flip-top-to-bottom;
    }

    [${placementAttr}="top-end"][${popoverAttr}] {
        bottom: anchor(top);
        right: anchor(right);
        margin-bottom: 8px;
        position-try-fallbacks: --flip-top-to-bottom, --flip-top-right;
    }

    /* Bottom Placement */
    [${placementAttr}="bottom"][${popoverAttr}] {
        top: anchor(bottom);
        left: anchor(center);
        translate: -50% 0;
        margin-top: 8px;
        position-try-fallbacks: --flip-bottom-to-top;
    }

    [${placementAttr}="bottom-start"][${popoverAttr}] {
        top: anchor(bottom);
        left: anchor(left);
        margin-top: 8px;
        position-try-fallbacks: --flip-bottom-to-top;
    }

    [${placementAttr}="bottom-end"][${popoverAttr}] {
        top: anchor(bottom);
        right: anchor(right);
        margin-top: 8px;
        position-try-fallbacks: --flip-bottom-to-top;
    }

    /* Left Placement */
    [${placementAttr}="left"][${popoverAttr}] {
        right: anchor(left);
        top: anchor(center);
        translate: 0 -50%;
        margin-right: 8px;
        position-try-fallbacks: --flip-left-to-right;
    }

    [${placementAttr}="left-start"][${popoverAttr}] {
        right: anchor(left);
        top: anchor(top);
        margin-right: 8px;
        position-try-fallbacks: --flip-left-to-right;
    }

    [${placementAttr}="left-end"][${popoverAttr}] {
        right: anchor(left);
        bottom: anchor(bottom);
        margin-right: 8px;
        position-try-fallbacks: --flip-left-to-right;
    }

    /* Right Placement */
    [${placementAttr}="right"][${popoverAttr}] {
        left: anchor(right);
        top: anchor(center);
        translate: 0 -50%;
        margin-left: 8px;
        position-try-fallbacks: --flip-right-to-left;
    }

    [${placementAttr}="right-start"][${popoverAttr}] {
        left: anchor(right);
        top: anchor(top);
        margin-left: 8px;
        position-try-fallbacks: --flip-right-to-left;
    }

    [${placementAttr}="right-end"][${popoverAttr}] {
        left: anchor(right);
        bottom: anchor(bottom);
        margin-left: 8px;
        position-try-fallbacks: --flip-right-to-left;
    }
}
`;
}
