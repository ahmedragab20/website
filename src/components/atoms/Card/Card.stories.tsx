import type { Meta, StoryObj } from "storybook-solidjs-vite";
import {
    Card,
    CardHeader,
    CardTitle,
    CardSubtitle,
    CardContent,
    CardFooter,
} from "./Card";
import { Text } from "../Text/Text";
import { Button } from "../Button/Button";

/**
 * Card component for containing related content.
 *
 * Provides a container with structured sub-components: Header, Title, Subtitle, Content, and Footer.
 * Use cards to group related information and create visual hierarchy.
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardSubtitle>Card Subtitle</CardSubtitle>
 *   </CardHeader>
 *   <CardContent>
 *     <Text>Card content</Text>
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */
const meta = {
    title: "Atoms/Card",
    component: Card,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        class: "sm:min-w-sm w-full",
    },
    argTypes: {
        padding: {
            control: "select",
            options: ["none", "sm", "md", "lg"],
            description:
                "Internal padding of the card container (usually 'none' when using sub-components)",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "none" },
            },
        },
        elevation: {
            control: "select",
            options: ["flat", "raised"],
            description: "Visual elevation of the card",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "flat" },
            },
        },
    },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic usage with new hierarchy
export const Default: Story = {
    args: {
        children: (
            <>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardSubtitle>You have 3 unread messages.</CardSubtitle>
                </CardHeader>
                <CardContent>
                    <div class="p-4 bg-tertiary rounded-md">
                        <Text>
                            Your production server is ready to simplify.
                        </Text>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="solid" color="accent" size="sm">
                        Mark all as read
                    </Button>
                </CardFooter>
            </>
        ),
    },
};

// Legacy/Simple usage (with manual padding override)
export const Simple: Story = {
    args: {
        padding: "md",
        children: (
            <Text>
                This is a basic card using the legacy padding prop directly on
                the container.
            </Text>
        ),
    },
};

export const WithComplexContent: Story = {
    args: {
        children: (
            <>
                <CardHeader>
                    <CardTitle>Create project</CardTitle>
                    <CardSubtitle>
                        Deploy your new project in one-click.
                    </CardSubtitle>
                </CardHeader>
                <CardContent>
                    <div class="flex flex-col gap-4">
                        <div class="flex flex-col gap-2">
                            <Text size="sm" weight="medium">
                                Name
                            </Text>
                            <div class="h-10 border border-ui-border rounded px-3 flex items-center bg-primary text-sm">
                                My Project
                            </div>
                        </div>
                        <div class="flex flex-col gap-2">
                            <Text size="sm" weight="medium">
                                Framework
                            </Text>
                            <div class="h-10 border border-ui-border rounded px-3 flex items-center bg-primary text-sm">
                                SolidJS
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter class="justify-between">
                    <Button variant="outline" color="primary">
                        Cancel
                    </Button>
                    <Button variant="solid" color="accent">
                        Deploy
                    </Button>
                </CardFooter>
            </>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: "Complex card layout demonstrating form elements and footer actions.",
            },
        },
    },
};

// Elevation
export const Raised: Story = {
    args: {
        elevation: "raised",
        children: (
            <>
                <CardHeader>
                    <CardTitle>Raised Card</CardTitle>
                    <CardSubtitle>This card stands out.</CardSubtitle>
                </CardHeader>
                <CardContent class="pb-6">
                    <Text>
                        Raised elevation adds a shadow to create visual depth.
                    </Text>
                </CardContent>
            </>
        ),
    },
};
