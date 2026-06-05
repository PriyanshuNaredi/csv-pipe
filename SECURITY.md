# Security Policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| 2.x     | Yes       |
| < 2.0   | No        |

## Reporting a vulnerability

Please report security issues privately, not as a public issue. Open a draft
advisory through GitHub's private vulnerability reporting:

https://github.com/martsinlabs/csv-pipe/security/advisories/new

Include a description, a minimal reproduction, and the affected version. You can
expect an initial response within a few days, and we will keep you updated until
the issue is resolved and disclosed.

## CSV formula injection

csv-pipe produces RFC 4180-compliant text. It does not, by default, neutralize
values that a spreadsheet application may interpret as a formula (for example a
cell beginning with `=`, `+`, `-`, or `@`). If you export untrusted data for use
in spreadsheets, sanitize such values before encoding, for example by prefixing
them with a quote. A built-in option is planned.
