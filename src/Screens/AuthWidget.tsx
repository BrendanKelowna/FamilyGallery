import React, { ReactNode } from "react";
import { StyleSheet, Text, View, ViewProps } from 'react-native';
import { Button } from "react-native-elements";
import { mainColor, styles } from "../../FamilyGallery";

export type AuthWidgetProps = Omit<ViewProps, "children"> & {
  title: string
  children?: ReactNode
  buttons?: ReactNode
  other?: ReactNode
  onClick: (() => void)
}

const thisStyles = StyleSheet.create({
  section: {
    flexDirection: "column",
    width: 300
  }
});

export default function AuthWidget({ title, children, buttons, other, onClick, ...props }: AuthWidgetProps) {
  return (
    <View style={styles.page} {...props}>
      <View style={thisStyles.section}>
        <Text style={{ ...styles.title, ...styles.mb }}>{title}</Text>
        {children}

        <View style={{ ...styles.mb, ...styles.button, width: styles.inputs.width }}>
          <Button title={title} onPress={onClick} buttonStyle={styles.buttonStyle} />
        </View>
        <View style={styles.pair}>
          {buttons}
        </View>
        {other}

      </View>
    </View>

  )
}