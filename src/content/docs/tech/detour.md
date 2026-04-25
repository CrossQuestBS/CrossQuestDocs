---
title: Detour Patching
description: A guide in my new Starlight docs site.
---

## Introduction

Detour Patching, allows you to change behaviour before, and after original method.
It is also possible to prevent original method from running.

## Example

### Prefix

```csharp
namespace BeatSaberQuestPatch.Patches;

[AccordPatch(
    declaringType: typeof(MainEffectCore), 
    methodName: "SetGlobalShaderValues", 
    arguments: [typeof(float), typeof(float)])
]
[AccordPrefix]
public partial class MainEffectPatch
{
    private static readonly int QuestWhiteboostMultiplier = Shader.PropertyToID("_QuestWhiteboostMultiplier");
    private static readonly int BloomMultiplier = Shader.PropertyToID("_BloomMultiplier");

    public MainEffectPatch()
    {
        Patch();
    }

    public bool Prefix(ref float arg1, ref float arg2)
    {
        Shader.SetGlobalFloat(QuestWhiteboostMultiplier, 0.0f);
        Shader.SetGlobalFloat(BloomMultiplier, 0.0f);
        arg1 = 0.0f;
        arg2 = 0.0f;
        return true;
    }
}
```

### Postfix

```csharp
namespace BeatSaberQuestPatch.Patches
{
    [AccordPatch(
        declaringType: typeof(MainMenuViewController), 
        methodName: "DidActivate",
        arguments: [])]
    [AccordPostfix]
    public partial class DisableEditorButton : IDisposable
    {

        public DisableEditorButton()
        {
            Patch();
        }
        
        public void Postfix(MainMenuViewController instance, ref bool arg1, ref bool arg2, ref bool arg3)
        {
            if (instance._beatmapEditorButton == null) return;
            var button = instance._beatmapEditorButton.gameObject;
            button.SetActive(false);
        }

        public void Dispose()
        {
            Unpatch();
        }
    }
}
```

