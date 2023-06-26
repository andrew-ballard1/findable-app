import React from 'react'
import {
	StyleSheet,
	// SafeAreaView,
	// ScrollView, 
	// Dimensions,
	// View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const ContentContainer = ({ children }) => {
	return (
		<SafeAreaView style={styles.safeContainer}>
			{/* <ScrollView contentContainerStyle={styles.contentContainer}> */}
				{children}
			{/* </ScrollView> */}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeContainer: {
		flex: 1,
		// height: '100%',
		// height: Dimensions.get('screen').height,
		// minHeight: Dimensions.get('screen').height,
		// width: Dimensions.get('screen').width,
		backgroundColor: '#eeeeee',
		// position: 'absolute',
	},
	contentContainer: {
		// flexGrow: 1,
		flex: 1,
		// position: 'absolute',
		// height: '100%'
	}
})

export default ContentContainer