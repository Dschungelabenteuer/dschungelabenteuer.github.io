# Personal website

## Development
```
npm run webpack
```

```
npm run dev
```

## Interesting notes and REX
Source images of the different parallax layers were SVGs because it was way lighter than actual images and would therefore reduce the load time. However, it seriously made the parallax effect scatter on most screens and browsers. I eventually decided to go for PNGs because the landscape is a big part of the website and should be impactful. The landscape is not render-blocking since I fetch the images and toggle the landscape once they've all been loaded, I imagine this is not that bad and a decision had to be taken between experience performance and load performance. Images are cached as well.