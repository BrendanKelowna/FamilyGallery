import React, { useState } from "react"
import { View, StyleSheet, TextInput, TextInputProps, SectionListProps, ButtonProps, FlatList, FlatListProps, Text, TouchableOpacity, ListRenderItem } from "react-native"
import { Button } from "react-native-elements/dist/buttons/Button"
import { SafeAreaView } from "react-native-safe-area-context"
import { mainColorL1, styles } from "../../FamilyGallery"

export type dbObj = { id: string, title: string }
export const dbNames = [
  { id: "bbkelly", title: "Brendan and Breanna" },
  { id: "dtkelly", title: "Darren and Tatiana" },
  { id: "acker", title: "Chris and Colleen" },
  { id: "murray", title: "Tyler and Shannon" }
] as readonly dbObj[]

export type SetDatabaseProps = {
  onPress: (email?: string, dbName?: string) => void
  textInputProps?: TextInputProps
  listProps?: FlatListProps<dbObj>
  buttonProps?: ButtonProps
}

export default function SetDatabase({ buttonProps, listProps, textInputProps, onPress }: SetDatabaseProps) {

  const [email, setemail] = useState("")
  const [dbName, setDbName] = useState(undefined as dbObj | undefined)

  const thisStyles = StyleSheet.create({
    container: {
      // flex: 0,
      //flexShrink: 1,
      // flexBasis: 200,
      marginBottom: 10,
    },
    button: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
    input: {
      borderRadius: 0,
      borderRightWidth: 0,
      borderLeftWidth: 0,
      // borderBottomLeftRadius: 0,
      // borderBottomRightRadius: 0,
    },
    itemText: {
      padding: 5,
      fontSize: 15,
    }
  })

  const handleSelect = (item: dbObj) => {
    setDbName(item)
  }

  const handleOnPress = () => {
    onPress(email, dbName?.id)
  }

  return (
    <View style={{ ...thisStyles.container, ...styles.border }}>
      <FlatList
        data={dbNames}
        renderItem={({ item }: { item: dbObj }): React.ReactElement | null => {
          const selected = (dbName?.id === item.id) ? { backgroundColor: mainColorL1 } : undefined
          return (
            <TouchableOpacity onPress={() => handleSelect(item)}>
              <Text style={{ ...thisStyles.itemText, ...selected }} >{item.title}</Text>
            </TouchableOpacity>
          )
        }}
        keyExtractor={item => item.id}
        style={styles.list}
        {...listProps}
      />
      <TextInput
        placeholder="Email..."
        onChangeText={(value) => setemail(value)}
        style={{ ...styles.inputs, ...thisStyles.input }}
        {...textInputProps}
      />
      <Button
        style={styles.button}
        buttonStyle={{ ...styles.buttonStyle, ...thisStyles.button }}
        title="Set Database"
        onPress={handleOnPress}
        {...buttonProps}

      />
    </View>
  )
}