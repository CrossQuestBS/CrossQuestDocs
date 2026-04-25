---
title: Setup
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
   ... # installation path will be here
   
   - 1.42.3
   ... # installation path will be here
```

Then you can run games install with Oculus Token.

If you are unsure how, you can check out [Guide to obtain your Oculus Token](https://computerelite.github.io/tools/Oculus/ObtainToken.html)
```sh
crossquest games install com.beatgames.beatsaber 1.42.3 -t "OC_TOKEN_HERE"
```


### Installing mods

After installing using CrossQuest we need to add required mods

#### Required to download and install
Download X-libs.zip and X-mods.zip from the latest release of following mods/libraries

* [Accord](https://github.com/CrossQuestBS/Accord/releases)
* [BSIPA](https://github.com/CrossQuestBS/BeatSaber-IPA-Reloaded/releases)
* [BeatSaberQuestPatch](https://github.com/CrossQuestBS/BeatSaberQuestPatch/releases)

#### Getting path of where to install 

Run command below to find the folder path to where to extract the zip files
```sh
crossquest games list
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

