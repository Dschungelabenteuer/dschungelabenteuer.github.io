# Personal website

## Development
```
npm run webpack
```

```
npm run dev
```

## Interesting notes and REX
Source images of the different parallax layers were SVGs because it was way lighter than actual images and would therefore reduce the load time. However, it seriously made the parallax effect scatter on most screens and browsers. I eventually decided to go for PNGs because the parallax effect is a big part of the website and should be impactful. (a5c3785)

Now the problem with fetched PNGs is that converting it to blob and setting that blob as elements backgrounds is not completely instant. There is a delay between the moment you set the background and the moment it appears (even though there is no additional request from network). It basically makes the different layers appear one by one, which is unacceptable. It was yet instant with SVGs.

I've tried to implement both solutions : load SVGs first and then, before triggering the parallax effect, replace them with PNGs. This gets the cache size growing significantly but it seems to work just fine even though there is no transition to PNG. There is therefore slight differences on transparency parts, this is the main reason why I've eventually decided to make the stars appear in a slow fade way.