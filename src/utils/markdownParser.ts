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
  console.log('Parsing markdown:', markdown);
  
  // Split the markdown into slides using horizontal rule as separator
  const slideTexts = markdown.split('\n---\n');
  console.log('Split into slides:', slideTexts);
  
  return slideTexts.map((slideText, index) => {
    const lines = slideText.trim().split('\n');
    console.log(`Processing slide ${index + 1}:`, lines);
    
    const titleLine = lines[0];
    const title = titleLine.replace(/^#\s+/, ''); // Remove heading marker if present
    
    // Keep the title in the content for proper markdown rendering
    const content = lines.join('\n').trim();
    console.log(`Slide ${index + 1} processed:`, { title, content });
    
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
    console.log('Loading presentation:', id);
    // Fix the URL path to point to the correct location
    const response = await fetch(`/presentations/${id}/slides.md`);
    if (!response.ok) {
      console.error('Failed to load presentation:', response.status, response.statusText);
      throw new Error(`Failed to load presentation: ${response.statusText}`);
    }
    
    const markdown = await response.text();
    console.log('Loaded markdown:', markdown);
    
    const slides = parseMarkdownToSlides(markdown);
    console.log('Parsed slides:', slides);
    
    // The presentation title is the first slide's title
    const title = slides[0]?.title || 'Untitled Presentation';
    
    const presentation = {
      id,
      title,
      slides
    };
    
    console.log('Returning presentation:', presentation);
    return presentation;
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
  // Allow both generated IDs and example presentation ID
  return /^(pres-\d+-[a-z0-9]+|example-presentation)$/.test(id);
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