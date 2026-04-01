#!/bin/bash

curl -fsSL "https://sh.rustup.rs" --proto "=https" --tlsv1.2 | sh -s -- -y
. $HOME.cargo/env
rustup target add x86_64-unknown-linux-gnu
rustup target add x86_64-pc-windows-msvc
cargo install --locked cargo-xwin

echo -e "\nRust toolchain installed successfully."
