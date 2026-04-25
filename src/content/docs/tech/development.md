---
title: Developing mods
description: A guide in my new Starlight docs site.
---

## Modding

### Introduction

Modding with CrossQuest is close to PC BSIPA, but with a few changes.

Instead of using [HarmonyX](https://github.com/BepInEx/HarmonyX?tab=readme-ov-file) we use [Accord](https://github.com/CrossQuestBS/Accord/tree/main). Instead of patching game code at runtime, it happens directly on the IL code.

Accord relies on [C# source generators](https://devblogs.microsoft.com/dotnet/introducing-c-source-generators/) and attributes.

See Detour article for Prefix and Postfix HarmonyX type patches, and Transpiler article for HarmonyX type transpilers.

### Example project

I recommend looking at [BeatSaberQuestPatch](https://github.com/CrossQuestBS/BeatSaberQuestPatch) for references to how the project setup is supposed to be.

It's important to include define Analyzer if you plan to use [Accord](https://github.com/CrossQuestBS/Accord/tree/main) for patching.

[csproj reference](https://github.com/CrossQuestBS/BeatSaberQuestPatch/blob/ec24e1ce22fa8866291ccf0d59c01364a311a587/BeatSaberQuestPatch/BeatSaberQuestPatch.csproj#L10-L20)
```xml
      <Reference Include="Accord">
        <HintPath>..\Dependencies\Accord.dll</HintPath>
      </Reference>
      <Reference Include="Accord.Common">
        <HintPath>..\Dependencies\Accord.Common.dll</HintPath>
      </Reference>
      <Analyzer Include="..\Dependencies\Generator\Accord.Generator.dll" />
      <Reference Include="IPA.Loader">
        <HintPath>..\Dependencies\IPA.Loader.dll</HintPath>
      </Reference>
        <Analyzer Include="..\Dependencies\Generator\IPA.Config.Generator.dll" />
```

If you need to use Transpiler then you need to make sure to use the suffix `.Build.dll` or seperate build process where the main mod assembly does not include AsmResolver or non AOT code.

`.Build` is a suffix used for knowing which files to remove before running il2cpp.

### Structure
* ExampleMod.dll
  * This code is running at runtime and should not include transpiler code or use non Ahead-of-type supported libraries.
  * Runtime "Transpiler" instance is defined here.
* ExampleMod.Build.dll
  * This is code running before the IL code gets converted to C++
  * This is usually used for Transpiler match and modification code.
* ExampleMod.csproj
  * This is mostly same as PC modding
  * Generators should be defined here, so they work when compiling the code or with IDE that support C# source generators.
* ExampleMod.csproj.user
  * This file should not be commited to Github as it's a local file
  * Goal of this file is to define BeatSaberDir.
