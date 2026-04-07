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
using CrossAccord.ILTrampoline.Attributes;
using CrossAccord.ILTrampoline.Interfaces;
using MappingExtensions.Patches.Trampoline;

namespace MappingExtensions.Build;

[AccordTrampolineBuild(
    declaringType: typeof(BeatmapObjectsInTimeRowProcessor), 
    methodName: nameof(BeatmapObjectsInTimeRowProcessor.HandleCurrentTimeSliceAllNotesAndSlidersDidFinishTimeSlice), 
    arguments: [typeof(BeatmapObjectsInTimeRowProcessor.TimeSliceContainer<BeatmapDataItem>), typeof(float)], 
    trampolinePatch: typeof(HandleCurrentTimeSliceAllNotesAndSlidersDidFinishTimeSlicePatch))
]
public class HandleCurrentTimeSliceAllNotesAndSlidersDidFinishTimeSlicePatchBuild : IAccordTrampolineBuild
{
    public IEnumerable<Func<CilInstruction, CilMatch>> MatchInstructions()
    {
        yield return instruction => 
            instruction.OpCode == CilOpCodes.Ldarg_0 ? CilMatch.Strict : CilMatch.None;
        yield return (instruction =>
        {
            if (instruction.OpCode != CilOpCodes.Ldfld ||
                instruction.Operand is not IFieldDescriptor fieldDescriptor)
                return CilMatch.None;
            
            return fieldDescriptor.Name == "_notesInColumnsReusableProcessingListOfLists" ? CilMatch.Strict : CilMatch.None;
        });
        yield return instruction => 
            instruction.OpCode == CilOpCodes.Ldloc_S ? CilMatch.Start : CilMatch.None;
        yield return (instruction =>
        {
            if (instruction.OpCode != CilOpCodes.Callvirt ||
                instruction.Operand is not IMethodDescriptor methodDescriptor)
                return CilMatch.None;
            
            return methodDescriptor.Name == "get_lineIndex" ? CilMatch.End : CilMatch.None;
        });
        yield return instruction => 
            instruction.OpCode == CilOpCodes.Ldelem_Ref ? CilMatch.Strict : CilMatch.None;
    }

    public IEnumerable<CilInstruction> PatchTrampoline(IEnumerable<CilInstruction> instructions, TypeDefinition definition, CilLocalVariable instance,
        ReferenceImporter importer)
    {
        var methodName = nameof(HandleCurrentTimeSliceAllNotesAndSlidersDidFinishTimeSlicePatch.ClampValues);
        var clampValueMethod = definition.Methods.FirstOrDefault(it => it.Name == methodName);

        if (clampValueMethod is null)
            throw new Exception($"Failed to find method of name: {methodName}");

        var localValue = instructions.ToArray()[0].Operand;
        
        yield return new CilInstruction(CilOpCodes.Ldloc, instance);
        yield return new CilInstruction(CilOpCodes.Ldloc_S, localValue);
        yield return new CilInstruction(CilOpCodes.Call, importer.ImportMethod(clampValueMethod));
    }
}
```

### For runtime

```csharp
using System;
using CrossAccord.Common.Interfaces;

namespace MappingExtensions.Patches.Trampoline;

public class HandleCurrentTimeSliceAllNotesAndSlidersDidFinishTimeSlicePatch : IAccordTrampolinePatch<BeatmapObjectSpawnMovementDataGetObstacleSpawnDataPatch>
{
    public static HandleCurrentTimeSliceAllNotesAndSlidersDidFinishTimeSlicePatch Instance
    {
        get;
        set;
    } = null;

    public int ClampValues(NoteData noteData)
    {
        return Math.Clamp(noteData.lineIndex, 0, 3);
    }
}
```

