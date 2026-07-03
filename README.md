# Memento Mori - Live

A live reminder of the value of death, and of living without fear of it.

**Live site:** https://migueldeguzman.github.io/memento-mori/

## What it does

- Shows a live estimate of how many people have died since you opened the page, today, and this year.
- Shows one Stoic quote per day, drawn from a database of 548 passages (`quotes.json`).
- One click shrinks the site into a small, resizable floating window that stays on top of your work, so the reminder lives beside whatever you are doing.

## How the counters work

The counters are extrapolated client-side from the UN World Population Prospects estimate of roughly 62 million deaths per year worldwide, which is about 1.9 deaths every second.
There is no backend, no API, and no tracking; it is pure arithmetic on your own clock.
The numbers are a meditation, not a measurement.

## The floating reminder

In Chrome and Edge the button uses the Document Picture-in-Picture API, which produces a true always-on-top window that stays above every application while you work.
It is resizable by dragging its edges, like any window.
In other browsers it falls back to a small popup positioned at the top-right of your screen.

## The quote database

All quotes live in [`quotes.json`](quotes.json), one JSON object per quote with `text`, `author`, and `source` fields.
The site picks the quote by day-of-year modulo the list length, so every day of the year (including leap days) has a quote, and extending the file automatically enriches the rotation.
Quotes are drawn from public-domain translations of Marcus Aurelius, Seneca, Epictetus, Musonius Rufus, Zeno, Cleanthes, Chrysippus, Cato, and the wider Stoic tradition, lightly modernized and in places condensed or paraphrased.
Entries marked "Attributed", "After ...", or "Proverbial" are traditional attributions or modern renderings in the Stoic spirit rather than verbatim ancient text.
Corrections and additions are welcome: edit `quotes.json` and open a pull request.

## Running locally

Any static file server works:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Philosophy

Memento mori - remember that you must die - is not morbid.
The Stoics kept death in view so that fear of it could not govern them, and so that no day would be spent as if days were limitless.
Roughly two people die every second; each tick of the counter is a life that ran out of time.
The point of watching it is not sorrow.
The point is to make the day you are in count.

## License

MIT.
Built by [Miguel de Guzman](https://github.com/migueldeguzman) and Claude (Anthropic) as co-authors.
