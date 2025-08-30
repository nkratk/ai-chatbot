Multi model side by side
    1. option to choose 2-4 models to compare
    2. simultaneous streaming
    3. side by side UI: real time comparision of responses.
    4. Message grouping: Track which responses came from which model
    5. Chat persistance: save and reload multi modal conversations

ModelSelector is designed for selecting a single item from a list.
Its state selectedModelId, its persisted to saveChatModelAsCookie

But we need MultiSelection.
The state needs to be an array instead of string.
selecting/deselecting an item is a toggle.

options:
1. updating the current component
    breaks the SRP (it will end up having two jobs single selection and multi selection)
2. create a new compoennt from the scratch

With the multi selection, we would need to render multiple chat compoennts

options:
1. reusing the chat component
    it contains header which uses the modal selector and input and other components
    which would be bad UX
2. we need single header, multi-modal-selector, single input and the results would be displayed specific to modal