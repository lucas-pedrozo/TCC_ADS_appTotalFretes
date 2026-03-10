# Build Android no Windows (erro "path longer than 260 characters")

Se o build falhar com:

```text
ninja: error: Stat(...): Filename longer than 260 characters
```

mesmo com **LongPathsEnabled** ativado no registro, use um **junction** para encurtar o caminho do projeto.

## Passo 1: Criar o junction (uma vez, PowerShell **como Administrador**)

No PowerShell **como Administrador**, execute:

```powershell
# Cria D:\TCC apontando para a pasta do repositório (ajuste se seu repositório estiver em outro lugar)
New-Item -ItemType Junction -Path "D:\TCC" -Target "D:\ProjetosDev\TCC\TCC_CursoTADS" -Force
New-Item -ItemType Junction -Path "D:\TCP" -Target "D:\TCC\TCC_ADS_appTotalFretes" -Force```

Ou via CMD (como Administrador):

```cmd
mklink /J D:\TCC D:\ProjetosDev\TCC\TCC_CursoTADS
```

## Passo 2: Build a partir do caminho curto

Sempre que for fazer o build Android, use o caminho pelo junction:

```powershell
cd D:\TCC\App
npx expo run:android
```

O projeto é o mesmo (é um link); apenas o caminho fica mais curto e o Ninja/CMake não estoura o limite de 260 caracteres.

## Limpar cache antes de tentar de novo

Se mudar de caminho ou quiser um build limpo:

```powershell
cd D:\ProjetosDev\TCC\TCC_CursoTADS\App\android
Remove-Item -Recurse -Force app\.cxx -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force app\build -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force build -ErrorAction SilentlyContinue
```

Depois rode o build pelo caminho curto: `cd D:\TCC\App` e `npx expo run:android`.

---

## Expo Go / desenvolvimento via Wi‑Fi

Se você usar **Expo Go** ou abrir o app no celular **via Wi‑Fi** (QR code), o **Metro também precisa ser iniciado pelo caminho curto**. Caso contrário pode aparecer:

- `Unable to resolve module ./ProjetosDev/TCC/TCC_CursoTADS/App/node_modules/expo/AppEntry`
- Erro 404 ao carregar o bundle
- Caminho duplicado ou maior que 260 caracteres na resolução de módulos

**Sempre que for rodar o servidor de desenvolvimento (Metro):**

```powershell
cd D:\TCC\App
npx expo start --clear
```

Use o QR code que aparecer nesse terminal para abrir no Expo Go ou no development build. Assim o projeto é servido a partir de `D:\TCC\App` e os caminhos ficam dentro do limite.


npx expo prebuild --clean --platform android
npx expo run:android
