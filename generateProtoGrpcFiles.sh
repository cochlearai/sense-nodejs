#!/bin/sh
OUTPUT_DIRECTORY="client"
NODE_BIN="node_modules/.bin"

mkdir -p client
export PATH="$(pwd)/${NODE_BIN}:$PATH"

grpc_tools_node_protoc CochlearaiSenseClient.proto\
  --js_out=import_style=commonjs,binary:${OUTPUT_DIRECTORY} \
  --grpc_out=${OUTPUT_DIRECTORY} \
  --plugin="protoc-gen-grpc=`which grpc_tools_node_protoc_plugin`" \

protoc CochlearaiSenseClient.proto\
  --plugin="protoc-gen-ts=./node_modules/.bin/protoc-gen-ts" \
  --ts_out="service=true:${OUTPUT_DIRECTORY}"