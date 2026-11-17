# Licensed technical fixture, NOT Arcturian character art

The Babylon renderer browser test downloads the Khronos glTF Sample Assets `CesiumMan.glb` file temporarily in GitHub Actions. This model is **only** a rig/animation/loader diagnostic input. It must never appear in the game's approved NPC registry.

Source: https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CesiumMan

License: Creative Commons Attribution 4.0 International for model-associated files; associated Cesium trademarks are excluded, per https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/CesiumMan/LICENSE.md .

Recorded upstream Git blob SHA: `8586c4e6a59bf8ef585c2a685c50a80d28503216`, size 438044 bytes.

The CI script checks its Git SHA before running tests and **does not** include the fixture in the deployed Vite app. No attribution claim for Arcturian art is made. A completed GLB load with correct skeleton/animations is necessary but never sufficient for authentic Arcturian NPC approval.
