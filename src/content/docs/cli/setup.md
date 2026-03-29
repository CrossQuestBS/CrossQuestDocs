---
title: How to use!
description: A guide in my new Starlight docs site.
---

### Installing requirements for modded version

Run following command to see list of supported games:

```sh
crossquest games list
```
```
Games
  com.beatgames.beatsaber
   - 1.42.2
   - 1.42.3
```

Then you can run games install with Oculus Token.

If you are unsure how, you can check out [Guide to obtain your Oculus Token](https://computerelite.github.io/tools/Oculus/ObtainToken.html)
```sh
crossquest games install com.beatgames.beatsaber 1.42.3 -t "OC_TOKEN_HERE"
```

### Compiling

To compile and build apk run the following 
```sh
crossquest games compile -b
```

If you also want to deploy modded apk to device run

```sh
crossquest games compile -b -d
```



