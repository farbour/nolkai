// file path: src/utils/markdownParser.ts

interface MarkdownSlide {
  id: string;
  title: string;
  content: string;
}

export interface Presentation {
  id: string;
  title: string;
  slides: MarkdownSlide[];
}

/**
 * Parses a markdown file into slides.
 * Slides are separated by '---' and the first line of each slide is the title.
 */
export function parseMarkdownToSlides(markdown: string): MarkdownSlide[] {
  // Split the markdown into slides using horizontal rule as separator
  const slideTexts = markdown.split('\n---\n');
  
  return slideTexts.map((slideText, index) => {
    const lines = slideText.trim().split('\n');
    const title = lines[0].replace(/^#\s+/, ''); // Remove heading marker if present
    const content = lines.slice(1).join('\n').trim();
    
    return {
      id: `slide-${index + 1}`,
      title,
      content
    };
  });
}

/**
 * Loads a presentation from a markdown file
 */
export async function loadPresentation(id: string): Promise<Presentation | null> {
  try {
    const response = await fetch(`/presentations/${id}/slides.md`);
    if (!response.ok) {
      throw new Error(`Failed to load presentation: ${response.statusText}`);
    }
    
    const markdown = await response.text();
    const slides = parseMarkdownToSlides(markdown);
    
    // The presentation title is the first slide's title
    const title = slides[0]?.title || 'Untitled Presentation';
    
    return {
      id,
      title,
      slides
    };
  } catch (error) {
    console.error('Error loading presentation:', error);
    return null;
  }
}

/**
 * Creates a new presentation with a unique ID
 */
export function createNewPresentation(): string {
  const id = `pres-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  return id;
}

/**
 * Validates a presentation ID format
 */
export function isValidPresentationId(id: string): boolean {
  return /^pres-\d+-[a-z0-9]+$/.test(id);
}

/**
 * Generates markdown content from slides
 */
export function slidesToMarkdown(slides: MarkdownSlide[]): string {
  return slides
    .map((slide, index) => {
      const slideContent = `# ${slide.title}\n\n${slide.content}`;
      return index === 0 ? slideContent : `---\n${slideContent}`;
    })
    .join('\n\n');
}