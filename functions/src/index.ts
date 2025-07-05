import googleAI, { gemini20Flash } from '@genkit-ai/googleai';
import {} from 'firebase-functions';
import { onCallGenkit } from 'firebase-functions/https';
import { defineSecret } from 'firebase-functions/params';
import { genkit, z } from 'genkit';

const geminiKey = defineSecret('GEMINI_API_KEY');

const ai = genkit({
  plugins: [googleAI()],
  model: gemini20Flash,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (prompt, ctx) => {
    const { stream, response } = ai.generateStream({
      prompt: `You are a useful AI Assitant, for NgKenya (2025) - You answer question based on the days agenda.

        If anyone asks you who you are, you respond by saying that you are NgKenya.

        if anyone asks you a question, please answer the questions 
        based on the information in the following website: https://ng-kenya.com/

        If anyone asks you a question that is not related to NgKenya, please respond with 
        "I am not sure about that, but you can check out the website for more information."

        ${prompt}

        RETURN DATA TEXT, NOT AS MARKDOWN
        
        Context:

        [START CONTEXT FOR AI AGENT]

Primary Context:

Event Name: Angular Kenya Conference 2025

Event Dates: 2025-07-04, 2025-07-05

Current Time: 12:27 EAT on 2025-07-05

Location: Nairobi, Kenya

Data Format: A list of event sessions with properties. Each session includes a Status key (Past, Happening Now, Upcoming) calculated relative to the Current Time.

Schedule for 2025-07-04 (Friday):

Session 1

Title: Arrival & Check-in

Time: 13:00 - 13:55

Status: Past

Room: Google Office

Speakers: None

Description: None

Session 2

Title: Angular Router Deep Dive Into Scalable Navigation Patterns

Time: 14:00 - 14:30

Status: Past

Room: Google Office

Speakers: Elvis Kimani

Description: Learn to leverage Angular Router Events as a powerful architectural tool for building modular, secure, and observable applications at scale.

Session 3

Title: Angular Schematics for Modular Architecture

Time: 14:40 - 15:10

Status: Past

Room: Google Office

Speakers: Frank Sitawa

Description: I will cover the basics of Angular Schematics and how you can use it to generate modules when you are using Modular Architecture.

Session 4

Title: Beyond the UI: Frontend Development Patterns

Time: 15:20 - 15:50

Status: Past

Room: Google Office

Speakers: Joshua Musa

Description: In this session, we’ll explore modern frontend development patterns that enable scalable, maintainable, and future-ready applications.

Session 5

Title: State Management In Angular With NgRx

Time: 16:00 - 16:30

Status: Past

Room: Google Office

Speakers: Benson Wainaina

Description: A gentle introduction to state management in Angular using NgRx library.

Session 6

Title: Transform your web experience with Angular Pipes

Time: 16:40 - 17:10

Status: Past

Room: Google Office

Speakers: Mofiro Jean

Description: A walk-through on the essentials of pipes in an angular applications and how it can be used in various domains across your angular app. This also involves how to create your own custom Angular pipe.

Schedule for 2025-07-05 (Saturday):

Session 7

Title: Arrival & Registration

Time: 08:00 - 08:55

Status: Past

Room: Auditorium

Speakers: None

Description: Expecting attendees to be at iHub, Jahazi Building, James Gichuru Road, Nairobi

Session 8

Title: Morning Refreshments

Time: 10:00 - 10:25

Status: Past

Room: Auditorium

Speakers: None

Description: Getting away with this cold weather

Session 9

Title: Open Remarks & Angular Kenya Keynote

Time: 11:00 - 11:10

Status: Past

Room: Auditorium

Speakers: None

Description: None

Session 10

Title: Partner’s Keynote: Angular Team

Time: 11:15 - 11:20

Status: Past

Room: Auditorium

Speakers: None

Description: None

Session 11

Title: Partner’s Keynote: Payd

Time: 11:20 - 11:25

Status: Past

Room: Auditorium

Speakers: None

Description: None

Session 12

Title: Partner’s Keynote: Developer Keynote by Allela Atieno

Time: 11:30 - 11:40

Status: Past

Room: Auditorium

Speakers: None

Description: A Google Developer Keynote unveils the latest Google platforms, tools, and AI advancements (like Gemini) to empower developers.

Session 13

Title: Developer Keynote : The State Of Angular

Time: 11:45 - 12:15

Status: Past

Room: Auditorium

Speakers: Wayne Gakuo

Description: A comprehensive overview of the Angular following the v20 release.

Session 14

Title: Technical Keynote 2: Because Performance is a Myth by Winnie Mandela

Time: 12:20 - 12:50

Status: Happening Now

Room: Auditorium

Speakers: Winnie Mandela

Description: Debunking the new hype on SSR and SSG from the hard truth by exploring the skeleton of SSR such as hydration, partial rendering, and deferred loading.

Session 15

Title: Beyond the Basics:- Advanced Angular State Management with NgRx

Time: 13:10 - 13:50

Status: Upcoming

Room: Auditorium

Speakers: Victor Preston, Nimrod Nyongesa

Description: A deep dive into NgRx patterns, feature store separation, selectors, effects, and maintaining sanity in large apps.

Session 16

Title: Reactive Forms with Angular: Scalable Patterns for Real-World Applications

Time: 13:10 - 13:50

Status: Upcoming

Room: Kigali

Speakers: Ken Mbira

Description: This talk explores how to build maintainable, testable, and scalable forms using Angular’s Reactive Forms API.

Session 17

Title: Echoes of Structure: Layered vs. Feature-Based Architecture in Angular

Time: 13:10 - 13:50

Status: Upcoming

Room: Co-Working Space

Speakers: John Kamau

Description: We dive deep into two of the most widely used architectural patterns in Angular: the classic layered approach and the feature-based structure.

Session 18

Title: Mastering Asynchronous Data Flows with TanStack Query Firebase

Time: 13:55 - 14:35

Status: Upcoming

Room: Auditorium

Speakers: Hassan Bahati

Description: This session will dive deep into advanced techniques for optimizing data fetching, caching, and synchronization using TanStack Query Firebase.

Session 19

Title: Angular Decorators and creating custom decorators

Time: 13:55 - 14:35

Status: Upcoming

Room: Kigali

Speakers: Job Alex Muturi

Description: A session to tackle: 1. What are Angular Decorators 2. Common Angular Decorators 3. How they work 4. Create custom decorator.

Session 20

Title: Building Scalable and Reusable Component Libraries in Angular

Time: 13:55 - 14:35

Status: Upcoming

Room: Co-Working Space

Speakers: Suleiman Yunus

Description: In this session, you'll master the essential architectural patterns needed to design and develop robust Angular component libraries.

Session 21

Title: Group Photo

Time: 14:40 - 15:30

Status: Upcoming

Room: Auditorium

Speakers: None

Description: None

Session 22

Title: Lunch

Time: 15:40 - 16:30

Status: Upcoming

Room: Auditorium

Speakers: None

Description: None

Session 23

Title: Building Engaging UX for Real-Time AI: A Deep Dive into Angular and LLM Streaming

Time: 16:35 - 17:35

Status: Upcoming

Room: Auditorium

Speakers: Maina Wycliffe

Description: This session teaches you how to stream data from Large Language Models word-by-word, creating natural, conversational user experiences with Angular, Signals, and RxJS.

Session 24

Title: Closing Remarks + Networking + Tea/Coffee & Snacks

Time: 17:40 - 18:00

Status: Upcoming

Room: Auditorium

Speakers: None

Description: None

[END CONTEXT]
        `,
    });

    for await (const chunk of stream) {
      ctx.sendChunk(chunk);
    }
    return (await response).text;
  }
);

export const chat = onCallGenkit(
  {
    secrets: [geminiKey],
  },
  chatFlow
);
