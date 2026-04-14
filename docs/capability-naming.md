# Capability Naming

This repository uses two naming layers on purpose.

## Official capability name

- Chinese user-facing product name: `全景图生成VR`
- English user-facing product name: `Panorama-to-VR`

Use this name in:

- Chinese documentation
- product-facing explanations
- release notes that describe the business capability

## Developer-facing names

Use English-only names in code, scripts, and interface declarations:

- Repository identity: `realsee-vr-skillkit`
- Canonical skill id: `realsee-pano-to-vr`
- Claude plugin namespace: `realsee-vr-skillkit`
- Runtime wording: `panorama-to-vr`

## Why the split exists

- Product naming should match the formal capability name
- Developer identifiers should stay stable and machine-friendly
- Host integrations should not break when the product wording changes
