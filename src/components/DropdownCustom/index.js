import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const style = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default function DropdownCustom({
  data,
  value,
  handleOnChange,
  labelOfValue,
  nameIcon = "house-chimney",
  isVisibleSearch = true,
  valueField = labelOfValue,
  placeholder,
  isDisable = false,
}) {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <Dropdown
      style={[style.dropdown, isFocus && { borderColor: "blue" }]}
      placeholderStyle={style.placeholderStyle}
      selectedTextStyle={style.selectedTextStyle}
      inputSearchStyle={style.inputSearchStyle}
      iconStyle={style.iconStyle}
      data={data}
      search={isVisibleSearch}
      maxHeight={300}
      labelField={labelOfValue}
      valueField={valueField}
      placeholder={!isFocus ? `${placeholder}` : "..."}
      searchPlaceholder="Search..."
      value={value}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={(item) => {
        handleOnChange(item);
        setIsFocus(false);
      }}
      renderLeftIcon={() => (
        <MaterialIcons
          style={style.icon}
          color={isFocus ? "blue" : "black"}
          name={nameIcon}
          size={20}
        />
      )}
      disable={isDisable}
    />
  );
}
