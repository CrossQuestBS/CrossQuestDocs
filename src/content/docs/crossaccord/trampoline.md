---
title: IL Trampoline
description: A guide in my new Starlight docs site.
---

## Introduction

IL Trampoline is a bit like transpilers, but instead of directly changing the IL, the IL is instead copied, and jumped to the modified IL if instance is active.

## Example

### Trampoline for Patching

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using AsmResolver.DotNet;
using AsmResolver.DotNet.Code.Cil;
using AsmResolver.PE.DotNet.Cil;
using BeatSaberQuestPatch.Patches.Trampoline;
using Accord.ILTrampoline.Attributes;
using Accord.ILTrampoline.Interfaces;

namespace BeatSaberQuestPatch.Build;

[AccordTrampolineBuild(typeof(BeatSaberInit), "get_settingsApplicator", [], typeof(BeatSaberInitTrampoline))]
public class BeatSaberInitTrampolineBuild : IAccordTrampolineBuild
{
    public IEnumerable<Func<CilInstruction, CilMatch>> MatchInstructions()
    {
        yield return (instruction => instruction.OpCode == CilOpCodes.Ldarg_0 ? CilMatch.Start : CilMatch.None);
        yield return (instruction => instruction.OpCode == CilOpCodes.Ldfld ? CilMatch.End : CilMatch.None);
    }
    
    public IEnumerable<CilInstruction> PatchTrampoline(IEnumerable<CilInstruction> instructions,
        TypeDefinition definition, CilLocalVariable instance, ReferenceImporter importer)
    {
        yield return new CilInstruction(CilOpCodes.Ldloc, instance);
        yield return new CilInstruction(CilOpCodes.Ldarg_0);
        yield return new CilInstruction(CilOpCodes.Call, importer.ImportMethod(definition.Methods.FirstOrDefault(it => it.Name == nameof(BeatSaberInitTrampoline.PatchApplicator))));
    }
}
```

### For runtime

```csharp
using Accord.Common.Interfaces;

namespace BeatSaberQuestPatch.Patches.Trampoline;

public class BeatSaberInitTrampoline : IAccordTrampolinePatch<BeatSaberInitTrampoline>
{
    public static BeatSaberInitTrampoline Instance { get; set; } = null;
    
    public SettingsApplicatorSO PatchApplicator(BeatSaberInit instance)
    {
        return instance._questSettingsApplicator;
    }
}
```

