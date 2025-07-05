import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  model,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { streamFlow } from 'genkit/beta/client';

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule],
  template: `
    <style>
      .typing-indicator {
        display: flex;
        align-items: center;
        height: 1.5rem;
      }
      .typing-dot {
        width: 0.5rem;
        height: 0.5rem;
        margin: 0 0.1rem;
        background: #a0aec0;
        border-radius: 50%;
        display: inline-block;
        animation: bounce 1.4s infinite both;
      }
      .typing-dot:nth-child(2) {
        animation-delay: 0.2s;
      }
      .typing-dot:nth-child(3) {
        animation-delay: 0.4s;
      }
      @keyframes bounce {
        0%,
        80%,
        100% {
          transform: scale(0.8);
          opacity: 0.7;
        }
        40% {
          transform: scale(1.2);
          opacity: 1;
        }
      }
    </style>
    <div class="bg-gray-100 font-sans">
      <div
        class="flex flex-col h-screen mx-auto w-full max-w-4xl bg-white shadow-lg"
      >
        <header class="bg-blue-600 text-white p-4 shadow-md">
          <h1 class="text-3xl font-bold text-center">NgKenya 2025 Chat</h1>
          <p class="text-center mt-2 italic">
            Ask me anything about the NgKenya 2025 conference!
          </p>
        </header>

        <main class="flex-1 p-6 overflow-y-auto" #chatContainer>
          <div class="flex flex-col space-y-4">
            @for (message of messages(); track message) {
            <div
              class="flex"
              [class.justify-end]="message.sender === 'user'"
              [class.justify-start]="message.sender !== 'user'"
            >
              <div
                [ngClass]="
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                "
                class="p-4 rounded-2xl max-w-lg shadow whitespace-pre-line"
              >
                @if (message.sender === 'assistant' && !message.text) {
                <span class="typing-indicator">
                  <span class="typing-dot"></span>
                  <span class="typing-dot"></span>
                  <span class="typing-dot"></span>
                </span>
                } @else {
                <p>{{ message.text }}</p>
                }
              </div>
            </div>
            }
          </div>
        </main>

        <footer class="p-4 bg-white border-t border-gray-200">
          <div class="flex items-center">
            <input
              type="text"
              class="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              [(ngModel)]="prompt"
              (keyup.enter)="send()"
              placeholder="Type your message..."
            />
            <button
              class="ml-3 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
              (click)="send()"
              [disabled]="!prompt()"
            >
              Send
            </button>
          </div>
        </footer>
      </div>
    </div>
  `,
})
export class AppComponent implements AfterViewInit {
  prompt = model<string>('');
  isStreaming = signal(false);
  responseText = signal<string>('');

  // Conversation history: { sender: 'user' | 'assistant', text: string }
  messages = signal<{ sender: 'user' | 'assistant'; text: string }[]>([
    { sender: 'assistant', text: '👋 Hi! How can I help you today?' },
  ]);

  @ViewChild('chatContainer') chatContainer?: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    queueMicrotask(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop =
          this.chatContainer.nativeElement.scrollHeight;
      }
    });
  }

  async send() {
    this.scrollToBottom();

    const prompt = this.prompt();
    this.prompt.set(''); // Clear input after sending
    if (!prompt) {
      return;
    }

    // Add user message to history
    this.messages.update((msgs) => [...msgs, { sender: 'user', text: prompt }]);
    this.isStreaming.set(true);
    this.responseText.set('');

    let assistantMsg = '';
    // Add placeholder for assistant message
    this.messages.update((msgs) => [
      ...msgs,
      { sender: 'assistant', text: '' },
    ]);
    this.scrollToBottom();

    try {
      const result = streamFlow({
        url: 'https://chat-bhbxz74naa-uc.a.run.app',
        input: prompt,
      });

      // Typewriter effect for streaming chunks
      for await (const chunk of result.stream) {
        const text = chunk.content[0].text;
        for (const char of text) {
          assistantMsg += char;
          // Update last assistant message in history
          this.messages.update((msgs) => {
            const updated = [...msgs];
            updated[updated.length - 1] = {
              sender: 'assistant',
              text: assistantMsg,
            };
            return updated;
          });
          this.scrollToBottom();
          await new Promise((res) => setTimeout(res, 15));
        }
      }

      // Get the final complete response
      const finalOutput = await result.output;
      console.log('Final output:', finalOutput);
    } catch (error) {
      console.error('Error streaming menu item:', error);
    } finally {
      this.isStreaming.set(false);
    }
    this.prompt.set('');
  }
}
