{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    wrangler-flake.url = "github:ryand56/wrangler";
  };

  outputs = {
    nixpkgs,
    flake-utils,
    wrangler-flake,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {
          inherit system;
          config = {
            allowUnfree = true;
          };
        };
      in
        with pkgs; {
          packages = {
            default = callPackage ./default.nix {};
          };
          devShells = {
            default = mkShell {
              packages = [
                just
                fastmod
                nodejs
                yarn
                crowdin-cli
                eas-cli

                typescript
                typescript-language-server

                wrangler-flake.packages.${system}.wrangler
              ];
            };
          };
        }
    );
}
