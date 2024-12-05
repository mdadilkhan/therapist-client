import React, { useState, useEffect } from "react";
import { FormControl, Select, MenuItem } from "@mui/material";

const QuarterDropdown = ({getQuarter}) => {
  const [selectedQuarter, setSelectedQuarter] = useState("");

  const getCurrentQuarter = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    let quarter = "";
    if (month >= 1 && month <= 3) {
      quarter = "JAN-MAR";
    } else if (month >= 4 && month <= 6) {
      quarter = "APR-JUN";
    } else if (month >= 7 && month <= 9) {
      quarter = "JUL-SEP";
    } else {
      quarter = "OCT-DEC";
    }
    return `(${quarter}) ${year}`;
  };

  useEffect(() => {
    const currentQuarter = getCurrentQuarter();
    setSelectedQuarter(currentQuarter);
    getQuarter(currentQuarter)
  }, []);

  const handleQuarterChange = (event) => {
    setSelectedQuarter(event.target.value);
    getQuarter(event.target.value)
  };

  const generateQuarters = () => {
    const years = Array.from({ length: 10 }, (_, i) => 2020 + i);
    const quarters = ["JAN-MAR", "APR-JUN", "JUL-SEP", "OCT-DEC"];
    let options = [];

    years.forEach((year) => {
      quarters.forEach((quarter) => {
        options.push(`(${quarter}) ${year}`);
      });
    });

    return options;
  };

  return (
    <FormControl
      fullWidth
      variant="outlined"
      sx={{
        "& .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
      }}
    >
      <Select
        value={selectedQuarter}
        onChange={handleQuarterChange}
        sx={{
          "& .MuiSelect-select": {
            padding: "0px",
            color: "#181126",
            textAlign: "center",
            fontFamily: "Nunito",
            fontSize: "12px",
            fontStyle: "normal",
            fontWeight: 900,
            lineHeight: "120%",
            letterSpacing: "0.07px",
          },
        }}
      >
        {generateQuarters().map((quarter, index) => (
          <MenuItem key={index} value={quarter}>
            {quarter}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default QuarterDropdown;
