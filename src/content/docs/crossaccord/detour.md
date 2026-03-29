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

[AccordPatch(typeof(SinglePlayerLevelSelectionFlowCoordinator), "get_enableCustomLevels")]
[AccordPrefix]
public partial class EnableCustomSongsPatch
{

    public EnableCustomSongsPatch()
    {
        Patch();
    }
    
    public MemberInfo MemberMethod => typeof(SinglePlayerLevelSelectionFlowCoordinator).GetMember("get_enableCustomLevels", (global::System.Reflection.BindingFlags)~0).FirstOrDefault()!;

    public bool Prefix(SinglePlayerLevelSelectionFlowCoordinator instance, ref bool returnValue)
    {
        returnValue = true;
        return false;
    }
}
```

### Prefix

```csharp
namespace BeatSaberQuestPatch.Patches
{
    [AccordPatch(typeof(MainMenuViewController), "DidActivate")]
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
        
        public MemberInfo MemberMethod { get; } = typeof(MainMenuViewController).GetMember("DidActivate", (global::System.Reflection.BindingFlags)~0).FirstOrDefault()!;
    }
}
```

