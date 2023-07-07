import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { Picker } from '@react-native-picker/picker'

const Dropdown = ({options = [{value: '', label: ''}], setter, selected}) => {
	const [selectedValue, setSelectedValue] = useState(selected ? selected : '')

	return (
		<View style={styles.container}>
			<Picker
				style={{width: '100%', height: '100%'}}
				selectedValue={selectedValue}
				onValueChange={(value) => {
					setter(value)
					setSelectedValue(value)
				}}
			>
				<Picker.Item key={'no_box'} label={'No Box'} value={''} />
				{options.map((option) => {
					return <Picker.Item key={option.value} label={option.label} value={option.value} />
				})}
			</Picker>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		minHeight: 40,
		borderWidth: 1,
		borderColor: '#eeeeee',
		color: '#333333',
		borderRadius: 5
	},
})

export default Dropdown