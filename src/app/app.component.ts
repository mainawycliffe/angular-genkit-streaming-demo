import { CommonModule } from '@angular/common';
import { Component, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { streamFlow } from 'genkit/beta/client';

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule],
  template: `
    <div class="bg-gray-100 font-sans">
      <div
        class="flex flex-col h-screen mx-auto w-full max-w-4xl bg-white shadow-lg"
      >
        <header class="bg-blue-600 text-white p-4 shadow-md">
          <h1 class="text-3xl font-bold text-center">
            Genkit Streaming Chat Demo
          </h1>
        </header>

        <main class="flex-1 p-6 overflow-y-auto">
          <div class="flex flex-col space-y-4">
            @if (prompt()) {
            <div class="flex justify-end">
              <div
                class="bg-blue-500 text-white p-4 rounded-2xl max-w-lg shadow"
              >
                <p>{{ prompt() }}</p>
              </div>
            </div>
            } @if (responseText()) {
            <div class="flex justify-start">
              <div
                class="bg-gray-200 text-gray-800 p-4 rounded-2xl max-w-lg shadow"
              >
                <p class="whitespace-pre-line">{{ responseText() }}</p>
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
export class AppComponent {
  prompt = model<string>('');

  isStreaming = signal(false);

  responseText = signal<string>('');

  async send() {
    const prompt = this.prompt();
    if (!prompt) {
      return;
    }

    this.isStreaming.set(true);
    this.responseText.set('');

    try {
      const result = streamFlow({
        url: 'https://chat-bhbxz74naa-uc.a.run.app',
        input: prompt,
      });

      // Typewriter effect for streaming chunks
      for await (const chunk of result.stream) {
        const text = chunk.content[0].text;
        for (const char of text) {
          this.responseText.update((prev) => prev + char);
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
  }
}
