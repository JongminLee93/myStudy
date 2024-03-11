export const melt = (array, idColumns, valueColumns, varColumnName = "variable", valueColumnName = "value") => {
  let meltedArray = [] as any[];

  array.forEach(item => {
    valueColumns.forEach(valueCol => {
      let record = {};

      // id 변수 값을 새 객체에 추가
      idColumns.forEach(idCol => {
        record[idCol] = item[idCol];
      });

      // variable과 value 열 추가
      record[varColumnName] = valueCol;
      record[valueColumnName] = item[valueCol];

      // 변환된 객체를 결과 배열에 추가
      meltedArray.push(record);
    });
  });

  return meltedArray;
}

export const groupSum = (data, groupBy) => {
  const result = [] as any[];
  const map = new Map();

  data.forEach(item => {
    const key = groupBy.map(id => item[id]).join('|');
    if (!map.has(key)) {
      map.set(key, { ...item });
    } else {
      const existingItem = map.get(key);
      existingItem.value += item.value;
      map.set(key, existingItem);
    }
  });

  map.forEach(value => {
    result.push(value);
  });

  return result;
}

export const meltAndGroupSum = (array, idColumns, valueColumns, varColumnName = "variable", valueColumnName = "value") => {
  const melted = melt(array, idColumns, valueColumns, varColumnName, valueColumnName)

  return groupSum(melted, [ ...idColumns, varColumnName ]);
}