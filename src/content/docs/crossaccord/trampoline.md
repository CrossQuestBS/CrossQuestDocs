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
using BeatSaberQuestPatch.Patches.Trampoline;
using CrossAccord.ILTrampoline.Attributes;
using CrossAccord.ILTrampoline.Interfaces;
using Mono.Cecil;
using Mono.Cecil.Cil;

namespace BeatSaberQuestPatch.Build;

[AccordTrampolineBuild(typeof(BeatSaberInit), "get_settingsApplicator", typeof(BeatSaberInitTrampoline))]
public class BeatSaberInitTrampolineBuild : IAccordTrampolineBuild
{
    public bool StartOffset(Instruction instructions)
    {
        return instructions.OpCode == OpCodes.Ldarg_0;
    }

    public bool EndOffset(Instruction instructions)
    {
        if (instructions.Operand is not FieldReference fieldRef)
            return false;
        
        return instructions.OpCode == OpCodes.Ldfld && fieldRef.Name.Contains("_standaloneSettingsApplicator");
    }

    public IEnumerable<Instruction> PatchTrampoline(IEnumerable<Instruction> instructions, TypeDefinition definition, VariableDefinition instance)
    {
        var typeDef = instance.VariableType.Resolve();
        foreach (var method in typeDef.Methods)
        {
            Console.WriteLine(method.Name);
        }
        var methodToCall = typeDef.Methods.First(it => it.Name.Contains("PatchApplicator"));
        var methodToCallRef = definition.Module.ImportReference(methodToCall);
        foreach (var instruction in instructions)
        {
            if (instruction.OpCode == OpCodes.Ldarg_0)
            {
                yield return Instruction.Create(OpCodes.Ldloc, instance);
                yield return instruction;
            }
            else if (instruction.OpCode == OpCodes.Ldfld)
            {
                yield return Instruction.Create(OpCodes.Call, methodToCallRef);
            }
        }
    }

    public int Matches => 1;
}
```

### For runtime

```csharp
using CrossAccord.Common.Interfaces;

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

