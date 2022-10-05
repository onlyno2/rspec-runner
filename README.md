# rspec-runner for Visual Studio Code (vscode)

Provives utilities to quickly run rspec files from vscode via vscode terminal

## Features
- Run all spec files
- Run current spec file with `ctrl alt F` or `cmd alt F`
- Run current spec line with `ctrl alt L` or `cmd alt L`

## ChangeLog
[ChangeLog](CHANGELOG.md)

## Configuration
Specify configuration (via navigating to File > Preferences > Workspace Settings and editing file settings.json). For example:
```json
{
  "rspec-runner.executePath": "rspec",
  "rspec-runner.outputFormat:" "documentation",
  "rspec-runner.useBundler": true
}
```

When using rails with docker, you can define an executable script and set `rspec-runner.executePath` to that script:
- rspec (root directory)
```bash
#!/bin/sh
docker-compose exec -T <your-service> bundle exec rspec "$@"
```
- configuration
```json
{
  "rspec-runner.executePath": "./rspec",
  "rspec-runner.outputFormat": "documentation",
  "rspec-runner.useBundler": true
}
```

## TODO
- Add more configuration options
- Add feature to run all specs within a folder

**Enjoy!**
