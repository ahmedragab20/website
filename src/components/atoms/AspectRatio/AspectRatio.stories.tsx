import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { AspectRatio } from "./AspectRatio";

/**
 * AspectRatio component maintains a consistent aspect ratio for its children.
 *
 * Use this component to ensure images, videos, and other content maintain a specific aspect ratio.
 *
 * @example
 * ```tsx
 * // Square image container
 * <AspectRatio>
 *   <img src="image.jpg" class="w-full h-full object-cover" alt="Example" />
 * </AspectRatio>
 *
 * // Video in 16:9 aspect ratio
 * <AspectRatio ratio="video">
 *   <iframe
 *     src="https://example.com/video"
 *     class="w-full h-full"
 *     title="Video"
 *   />
 * </AspectRatio>
 * ```
 */
const meta = {
    title: "Atoms/AspectRatio",
    component: AspectRatio,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        ratio: {
            control: { type: "select" },
            options: ["square", "video", "4/3", "3/2", "16/10", "21/9"],
            description: "The aspect ratio to maintain",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "square" },
            },
        },
        children: {
            control: false,
            description:
                "The content to display within the aspect ratio container",
        },
        class: {
            control: { type: "text" },
            description: "CSS class name",
        },
    },
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Square: Story = {
    args: {
        ratio: "square",
        children: (
            <div class="w-full h-full bg-linear-to-br from-accent to-primary flex items-center justify-center">
                <span class="text-white font-semibold">1:1</span>
            </div>
        ),
    },
};

export const Video: Story = {
    args: {
        ratio: "video",
        children: (
            <div class="w-full h-full bg-linear-to-br from-primary to-accent flex items-center justify-center">
                <span class="text-white font-semibold">16:9</span>
            </div>
        ),
    },
};

export const FourThird: Story = {
    args: {
        ratio: "4/3",
        children: (
            <div class="w-full h-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <span class="text-white font-semibold">4:3</span>
            </div>
        ),
    },
};

export const ThreeSecond: Story = {
    args: {
        ratio: "3/2",
        children: (
            <div class="w-full h-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span class="text-white font-semibold">3:2</span>
            </div>
        ),
    },
};

export const SixteenTenth: Story = {
    args: {
        ratio: "16/10",
        children: (
            <div class="w-full h-full bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <span class="text-white font-semibold">16:10</span>
            </div>
        ),
    },
};

export const TwentyoneNinth: Story = {
    args: {
        ratio: "21/9",
        children: (
            <div class="w-full h-full bg-linear-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <span class="text-white font-semibold">21:9</span>
            </div>
        ),
    },
};

export const WithImage: Story = {
    args: {
        ratio: "video",
        children: (
            <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop"
                alt="Mountain landscape"
                class="w-full h-full object-cover"
            />
        ),
    },
    description:
        "AspectRatio with an image that maintains the correct aspect ratio",
};

export const WithCustomClass: Story = {
    args: {
        ratio: "square",
        class: "border-4 border-accent rounded-lg shadow-lg",
        children: (
            <div class="w-full h-full bg-secondary flex items-center justify-center p-4">
                <span class="text-fg-main font-semibold text-center">
                    Custom styling applied
                </span>
            </div>
        ),
    },
    description: "AspectRatio with custom CSS classes applied",
};

export const ImageGallery: Story = {
    render: () => (
        <div class="grid grid-cols-2 gap-4 w-full max-w-2xl">
            <AspectRatio ratio="square">
                <img
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop"
                    alt="Gallery 1"
                    class="w-full h-full object-cover rounded"
                />
            </AspectRatio>
            <AspectRatio ratio="square">
                <img
                    src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=400&fit=crop"
                    alt="Gallery 2"
                    class="w-full h-full object-cover rounded"
                />
            </AspectRatio>
            <AspectRatio ratio="square">
                <img
                    src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=400&fit=crop"
                    alt="Gallery 3"
                    class="w-full h-full object-cover rounded"
                />
            </AspectRatio>
            <AspectRatio ratio="square">
                <img
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop"
                    alt="Gallery 4"
                    class="w-full h-full object-cover rounded"
                />
            </AspectRatio>
        </div>
    ),
    description: "Image gallery using AspectRatio for consistent sizing",
};

export const ResponsiveLayout: Story = {
    render: () => (
        <div class="flex flex-col gap-6 w-full max-w-4xl">
            <div>
                <span class="text-sm font-semibold text-fg-muted mb-2 block">
                    Video (16:9)
                </span>
                <AspectRatio ratio="video" class="rounded-lg overflow-hidden">
                    <div class="w-full h-full bg-tertiary flex items-center justify-center">
                        <span class="text-fg-main">Video Player</span>
                    </div>
                </AspectRatio>
            </div>

            <div>
                <span class="text-sm font-semibold text-fg-muted mb-2 block">
                    Featured Image (4:3)
                </span>
                <AspectRatio ratio="4/3" class="rounded-lg overflow-hidden">
                    <div class="w-full h-full bg-tertiary flex items-center justify-center">
                        <span class="text-fg-main">Featured Image</span>
                    </div>
                </AspectRatio>
            </div>

            <div>
                <span class="text-sm font-semibold text-fg-muted mb-2 block">
                    Thumbnail (1:1)
                </span>
                <AspectRatio
                    ratio="square"
                    class="rounded-lg overflow-hidden w-32"
                >
                    <div class="w-full h-full bg-tertiary flex items-center justify-center">
                        <span class="text-fg-main text-sm">Thumbnail</span>
                    </div>
                </AspectRatio>
            </div>
        </div>
    ),
    description: "Multiple AspectRatio components with different ratios",
};

export const AccessibleExample: Story = {
    args: {
        ratio: "video",
        children: (
            <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop"
                alt="Product showcase - landscape mountain view with hiking trail"
                class="w-full h-full object-cover"
            />
        ),
    },
    parameters: {
        docs: {
            description: {
                story: "AspectRatio with proper accessibility attributes. Always include meaningful alt text for images.",
            },
        },
    },
};
