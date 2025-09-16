#!/bin/bash

ROOT_DIR=$(pwd)

# Расширения файлов, которые обрабатывать
extensions=("ts" "js" "tsx" "mjs")

# Папки, которые нужно игнорировать (все вложенные тоже игнорируются)
excluded_dirs=("node_modules" "dist" "build" ".git")

# 3) Генерим find-условие для расширений
find_ext_args=()
for ext in "${extensions[@]}"; do
  find_ext_args+=( -name "*.$ext" -o )
done
# убираем последний «-o»
unset 'find_ext_args[${#find_ext_args[@]}-1]'

# 4) Генерим find-условие для исключений
find_exc_args=()
for dir in "${excluded_dirs[@]}"; do
  find_exc_args+=( -path "*/$dir/*" -o )
done
unset 'find_exc_args[${#find_exc_args[@]}-1]'

# 5) Определяем флаг для sed-inplace: для macOS (-i '') и для Linux (-i)
if [[ "$(uname)" == "Darwin" ]]; then
  SED_INPLACE=(-i '')
else
  SED_INPLACE=(-i)
fi

# 6) Основной цикл: исключаем папки, ищем файлы, вставляем/апдейтим комментарии
find . \( "${find_exc_args[@]}" \) -prune -o -type f \( "${find_ext_args[@]}" \) -print | \
while IFS= read -r file; do
  abs_path=$(realpath "$file")
  rel_path=${abs_path#$ROOT_DIR/}
  comment="// path: $rel_path"

  # Смотрим первые 5 строк
  head5=$(head -n 5 "$file")

  if echo "$head5" | grep -q "^// "; then
    # обновляем первую строку-комментарий
    sed "${SED_INPLACE[@]}" "0,/^\/\/ /s|^// .*|$comment|" "$file" \
      && echo "Обновлён комментарий в $rel_path"
  else
    # добавляем комментарий в начало
    { echo "$comment"; cat "$file"; } > "$file.tmp" && mv "$file.tmp" "$file" \
      && echo "Добавлен комментарий в $rel_path"
  fi
done