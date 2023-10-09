# stackoverflow inspired project

Following JSmastery course

## clert authentication

## shadcn UI

Gotcha:

> tailwind.config.ts will be overridden.
> now sure if it works out of box when "src" dir is activated

## Next.js features that's new to me

### usePathname

## Typescript

```
// page.tsx
<QuestionCard question={question}>

// QuestionCard.tsx
type QuestionCardProps = {
  title: string;
  tags: string[];
  votes: number;
  answers: number;
  views: number;
  askedBy: string;
};
const QuestionCard = ({ question }: { question: QuestionCardProps })

//the other way to declare type
type QuestionCardProps = {
    question: {
        title: string;
        tags: string[];
        votes: number;
        answers: number;
        views: number;
        askedBy: string;
    }
};
const QuestionCard = ({ question }: QuestionCardProps )
```

## tailwind and CSS

### responsive

[https://tailwindcss.com/docs/responsive-design](https://tailwindcss.com/docs/responsive-design)

`max-sm` means `@media not all and (min-width: 640px) {...`

the "not" negate all the stuff after it, so it means **"not (all and (min-width:640px))"**, effectively means **for screens smaller than 640px**
The CSS syntax is mind-bending, why not using `@media all and (max-width:640px)` instead?
Anyway, hopefully the `max-sm` is straight-forward name.

### line clamp

`line-clamp-3` limit content to show 3 lines, remain represent with "..."
