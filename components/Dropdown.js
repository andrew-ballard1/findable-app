import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { Picker } from '@react-native-picker/picker'

const Dropdown = ({options = [{value: '', label: '', description: ''}], setter, selected}) => {
	const [selectedValue, setSelectedValue] = useState(selected ? selected : '')

	return (
		// <View style={styles.container}>
			<Picker
				style={{width: '100%', height: 40, backgroundColor: 'white'}}
				selectedValue={selectedValue}
				itemStyle={{height: 40, width: '100%'}}
				onValueChange={(value) => {
					setter(value)
					setSelectedValue(value)
				}}
			>
				<Picker.Item style={{height: 30}} key={'no_box'} label={'No Box'} value={''} />
				{options.map((option) => {
					console.log(option)
					return <Picker.Item style={{height: 30}} key={option.value} label={`${option.label} - ${option.description}`} value={option.value} />
				})}
			</Picker>
		// </View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex:1,
		justifyContent: 'center',
		alignItems: 'center',
		// width: '100%',
		minHeight: 40,
		height: 40,
		padding: 0,
		borderWidth: 1,
		borderColor: '#eeeeee',
		color: '#333333',
		borderRadius: 5,
		marginHorizontal: 10
	},
})

export default Dropdown