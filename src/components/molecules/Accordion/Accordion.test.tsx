import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@solidjs/testing-library";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "./Accordion";
import { createSignal } from "solid-js";

// Mock Chevron for tests
const ChevronIcon = () => <svg data-testid="chevron" />;

const TestAccordion = (props: any) => (
    <Accordion {...props}>
        <AccordionItem value="item-1">
            <AccordionTrigger>
                Item 1 <ChevronIcon />
            </AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
            <AccordionTrigger>
                Item 2 <ChevronIcon />
            </AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
    </Accordion>
);

describe("Accordion", () => {
    it("renders with default value", () => {
        render(() => <TestAccordion type="single" defaultValue="item-1" />);

        // Initial render might be sync or async depending on RAF, but defaultValue usually sets state immediately.
        // However, with our new logic: const [animationState] = createSignal(isSelected() ? "open" : "closed");
        // It should be immediate.

        const trigger1 = screen.getByText("Item 1");

        expect(trigger1.closest("details")).toHaveAttribute("open");
        expect(trigger1.closest("summary")).toHaveAttribute(
            "aria-expanded",
            "true"
        );

        const trigger2 = screen.getByText("Item 2");
        expect(trigger2.closest("details")).not.toHaveAttribute("open");
        expect(trigger2.closest("summary")).toHaveAttribute(
            "aria-expanded",
            "false"
        );
    });

    it("toggles content on click (single mode)", async () => {
        render(() => <TestAccordion type="single" collapsible />);

        const trigger1 = screen.getByText("Item 1");
        const trigger2 = screen.getByText("Item 2");

        expect(trigger1.closest("details")).not.toHaveAttribute("open");
        expect(trigger1.closest("summary")).toHaveAttribute(
            "aria-expanded",
            "false"
        );

        // Click item 1
        fireEvent.click(trigger1);
        await waitFor(() => {
            expect(trigger1.closest("details")).toHaveAttribute("open");
            expect(trigger1.closest("summary")).toHaveAttribute(
                "aria-expanded",
                "true"
            );
        });

        // Click item 2 (should close item 1)
        fireEvent.click(trigger2);
        await waitFor(() => {
            expect(trigger2.closest("details")).toHaveAttribute("open");
            expect(trigger2.closest("summary")).toHaveAttribute(
                "aria-expanded",
                "true"
            );
        });

        expect(trigger1.closest("details")).not.toHaveAttribute("open");
        expect(trigger1.closest("summary")).toHaveAttribute(
            "aria-expanded",
            "false"
        );

        // Click item 2 again (should close if collapsible)
        fireEvent.click(trigger2);
        await waitFor(() => {
            expect(trigger2.closest("details")).not.toHaveAttribute("open");
            expect(trigger2.closest("summary")).toHaveAttribute(
                "aria-expanded",
                "false"
            );
        });
    });

    it("allows multiple items open (multiple mode)", async () => {
        render(() => <TestAccordion type="multiple" />);

        const trigger1 = screen.getByText("Item 1");
        const trigger2 = screen.getByText("Item 2");

        fireEvent.click(trigger1);
        await waitFor(() => {
            expect(trigger1.closest("details")).toHaveAttribute("open");
            expect(trigger1.closest("summary")).toHaveAttribute(
                "aria-expanded",
                "true"
            );
        });

        fireEvent.click(trigger2);
        await waitFor(() => {
            expect(trigger2.closest("details")).toHaveAttribute("open");
            expect(trigger2.closest("summary")).toHaveAttribute(
                "aria-expanded",
                "true"
            );
        });
        expect(trigger1.closest("details")).toHaveAttribute("open");
        expect(trigger1.closest("summary")).toHaveAttribute(
            "aria-expanded",
            "true"
        );
    });

    it("respects disabled prop on Item", () => {
        render(() => (
            <Accordion type="single">
                <AccordionItem value="item-1" disabled>
                    <AccordionTrigger>Item 1</AccordionTrigger>
                    <AccordionContent>Content 1</AccordionContent>
                </AccordionItem>
            </Accordion>
        ));

        const trigger = screen.getByText("Item 1").closest("summary");
        expect(trigger).toHaveAttribute("aria-disabled", "true");

        fireEvent.click(trigger!);
        expect(trigger?.closest("details")).not.toHaveAttribute("open");
        expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("supports controlled state", async () => {
        const [value, setValue] = createSignal<string | string[]>("item-1");
        const handleValueChange = vi.fn((val: string | string[]) =>
            setValue(val)
        );

        render(() => (
            <TestAccordion
                type="single"
                value={value()}
                onValueChange={handleValueChange}
            />
        ));

        expect(screen.getByText("Item 1").closest("details")).toHaveAttribute(
            "open"
        );
        expect(screen.getByText("Item 1").closest("summary")).toHaveAttribute(
            "aria-expanded",
            "true"
        );

        fireEvent.click(screen.getByText("Item 2"));

        expect(handleValueChange).toHaveBeenCalledWith("item-2");

        await waitFor(() => {
            expect(
                screen.getByText("Item 2").closest("details")
            ).toHaveAttribute("open");
            expect(
                screen.getByText("Item 2").closest("summary")
            ).toHaveAttribute("aria-expanded", "true");
        });
    });

    it("has correct accessibility attributes", () => {
        render(() => <TestAccordion />);

        const trigger = screen.getByText("Item 1").closest("summary");
        const content = screen
            .getByText("Content 1")
            .closest('[role="region"]');

        expect(trigger).toHaveAttribute("aria-controls");
        expect(content).toHaveAttribute("aria-labelledby");
        expect(trigger?.getAttribute("aria-controls")).toBe(content?.id);
        expect(content?.getAttribute("aria-labelledby")).toBe(trigger?.id);

        fireEvent.click(trigger!);
        // aria-expanded should be immediate as it depends on selection, not animation state?
        // Logic: aria-expanded={isOpen()}. isOpen depends on rootContext.value.
        // rootContext.value updates immediately.
        // So this should pass without waitFor.
        expect(trigger).toHaveAttribute("aria-expanded", "true");
    });
});
