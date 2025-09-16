# Notes

## 25% Minimal (page 8)

I will use HTML, Tailwind CSS and Typescript.
Presentation:
	HTML: to provide the structure and content of the page: layout of the webpage, including headings, paragraphs, links, images, and other elements.
	Tailwind CSS: to style the HTML: overall aesthetics of the webpage.
Interactivity
	Typescript:  to add interactivity and dynamic behavior to webpages: dynamic content updates without reloading the page.

I have created a simple page, that I will call raw page with the board game(field, paddles and balls): used "canvas" for the board, typescript for drawing and moving elements (paddles and ball). Can considered tovuse framework to add complexity later.

I will work on:
- Score updating: draw and update with TS
- Single match (either against other player or AI): using TS
- Tournament (either with other players or AI): registration system (alias), matchamaking system (make a draw and announce it): draw and update with TS
- AI logic: TS;

Raw page will have all elements necessary to complete the 25%,  I will give style to the page afterwards. First I want to have all element on the page, then I will organize them.

## USEFUL INFO
- to compile script.ts, just need to type tsc in the shell (need to type in the same direcotry as tsconfig.json). First check if you node installed (node -v), if yes npm install -g typescript, if not, first need to install node first. 
- tsconfig.json: it configures flags i want to compile without calling it one by one. Right now only using basics ones, that i know what they are for.
- index.html: will be our only html page. From my understanding to be single page application means that the content is dynamically created, so all content is created by TS, and there are no other HTML pages (to be checked when we have more elemetns on the page).
- To run it, download the extension Live Server in VS Code. Then rght click on the index.html and select open wiht Live Server (it will show which keys to use to open wihtout right clicking). Or you can just open in web browser. To move left player "w" and "s" to move right player "i" or "k". you can start the game by pressing "Enter" and pause the game by "p."

## Modules

## USER MANAGEMENT

## AI

## Graphics
