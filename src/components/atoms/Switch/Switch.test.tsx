import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { Switch } from "./Switch";

describe("Switch", () => {
    it("renders and toggles uncontrolled", async () => {
        render(() => <Switch aria-label="switch" />);
        const el = screen.getByRole("switch");
        expect(el).toBeInTheDocument();
        expect(el).toHaveAttribute("aria-checked", "false");

        await fireEvent.click(el);
        expect(el).toHaveAttribute("aria-checked", "true");

        await fireEvent.click(el);
        expect(el).toHaveAttribute("aria-checked", "false");
    });

    it("calls onChange with new value", async () => {
        const onChange = vi.fn();
        render(() => <Switch onChange={onChange} aria-label="switch" />);
        const el = screen.getByRole("switch");
        await fireEvent.click(el);
        expect(onChange).toHaveBeenCalledWith(true);
    });

    it("respects controlled checked prop", async () => {
        // Use a parent signal to simulate controlled prop behavior
        const Controlled = () => {
            const [state, setState] = createSignal(false);
            // expose setter for test by attaching to window (safe in test env)
            (window as any).__setSwitch = setState;
            return <Switch checked={state()} aria-label="switch" />;
        };

        render(() => <Controlled />);
        const el = screen.getByRole("switch");
        expect(el).toHaveAttribute("aria-checked", "false");

        // update controlled value
        (window as any).__setSwitch(true);
        expect(el).toHaveAttribute("aria-checked", "true");

        // cleanup helper
        delete (window as any).__setSwitch;
    });

    it("is keyboard accessible (Space/Enter)", async () => {
        render(() => <Switch aria-label="switch" />);
        const el = screen.getByRole("switch");
        el.focus();
        await fireEvent.keyDown(el, { key: " ", code: "Space" });
        expect(el).toHaveAttribute("aria-checked", "true");

        await fireEvent.keyDown(el, { key: "Enter", code: "Enter" });
        expect(el).toHaveAttribute("aria-checked", "false");
    });

    it("does not toggle when disabled", async () => {
        const onChange = vi.fn();
        render(() => (
            <Switch disabled onChange={onChange} aria-label="switch" />
        ));
        const el = screen.getByRole("switch");
        expect(el).toHaveAttribute("aria-disabled", "true");

        await fireEvent.click(el);
        expect(onChange).not.toHaveBeenCalled();
    });

    it("supports sizes", () => {
        const { container: c1 } = render(() => (
            <Switch size="sm" aria-label="switch-sm" />
        ));
        const { container: c2 } = render(() => (
            <Switch size="md" aria-label="switch-md" />
        ));
        const { container: c3 } = render(() => (
            <Switch size="lg" aria-label="switch-lg" />
        ));

        expect(c1.querySelector("div[role='switch'] > div")).toHaveClass("w-9");
        expect(c2.querySelector("div[role='switch'] > div")).toHaveClass(
            "w-11"
        );
        expect(c3.querySelector("div[role='switch'] > div")).toHaveClass(
            "w-14"
        );
    });
});
