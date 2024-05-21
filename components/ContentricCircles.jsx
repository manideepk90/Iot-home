import React from "react";
import CircleContainer from "./CircleContainer";
import { View } from "react-native";
const ContentricCircles = ({ children, style = {} }) => {
  return (
    <CircleContainer borderTopLeftRadius={400} borderTopRightRadius={400}>
      <CircleContainer borderTopLeftRadius={360} borderTopRightRadius={360}>
        <CircleContainer borderTopLeftRadius={360} borderTopRightRadius={360}>
          <CircleContainer borderTopLeftRadius={300} borderTopRightRadius={300}>
            <CircleContainer
              borderTopLeftRadius={300}
              borderTopRightRadius={300}
            >
              <CircleContainer
                borderTopLeftRadius={300}
                borderTopRightRadius={300}
              >
                <CircleContainer
                  borderTopLeftRadius={300}
                  borderTopRightRadius={300}
                >
                  <CircleContainer
                    borderTopLeftRadius={260}
                    borderTopRightRadius={260}
                  >
                    <CircleContainer
                      borderTopLeftRadius={260}
                      borderTopRightRadius={260}
                    >
                      <CircleContainer>{children}</CircleContainer>
                    </CircleContainer>
                  </CircleContainer>
                </CircleContainer>
              </CircleContainer>
            </CircleContainer>
          </CircleContainer>
        </CircleContainer>
      </CircleContainer>
    </CircleContainer>
  );
};

export default ContentricCircles;
