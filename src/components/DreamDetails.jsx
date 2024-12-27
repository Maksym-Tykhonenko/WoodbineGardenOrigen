import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput, ScrollView, Alert, ImageBackground } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import { Calendar } from 'react-native-calendars';
import Icons from './Icons';

const { height, width } = Dimensions.get('screen');

const DreamDetails = ({ dream }) => {
    const navigation = useNavigation(); 
    const [calendar, setCalendar] = useState(false);
    const [wish, setWish] = useState(dream.wish);
    const [desc, setDesc] = useState(dream.desc);
    const [date, setDate] = useState(dream.date);
    const [budget, setBudget] = useState(dream.budget);

    const [wishError, setWishError] = useState('');
    const [descError, setDescError] = useState('');
    const [dateError, setDateError] = useState('');
    const [budgetError, setBudgetError] = useState('');
    const [isValid, setIsValid] = useState(true);

    const handleDayPress = (day) => {
        const rawDate = new Date(day.dateString);
        const formattedDate = `${String(rawDate.getDate()).padStart(2, '0')}.${String(rawDate.getMonth() + 1).padStart(2, '0')}.${rawDate.getFullYear()}`;
        setDate(formattedDate);
        setCalendar(false);
        setDescError('');
    };    

    const validation = () => {
        let valid = true;

        setWishError('');
        setDescError('');
        setDateError('');
        setBudgetError('');

        if (!wish) {
            setWishError('Wish cannot be empty.');
            valid = false;
        }
        if (!desc) {
            setDescError('Description cannot be empty.');
            valid = false;
        }
        if (!date) {
            setDateError('Please select a date.');
            valid = false;
        } else {
            const selectedDate = new Date(date);
            const today = new Date();
            if (selectedDate <= today) {
                setDateError('Please select a future date.');
                valid = false;
            }
        }
        if (!budget) {
            setBudgetError('Budget cannot be empty.');
            valid = false;
        }

        if(valid) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }

        if (!valid) return;

    };

    const editDream = async () => {
        validation();

        const updatedDream = {
            ...dream,
            wish,
            desc,
            date,
            budget,
            inprogress: true,
            done: false,
        };
    
        try {
            const existingDreams = await AsyncStorage.getItem('dreams');
            let dreamsArray = existingDreams ? JSON.parse(existingDreams) : [];
    
            dreamsArray = dreamsArray.map((item) => 
                item.id === dream.id ? updatedDream : item
            );
    
            await AsyncStorage.setItem('dreams', JSON.stringify(dreamsArray));
            Alert.alert("Success", "Dream updated successfully!");
    
            navigation.goBack();
        } catch (error) {
            console.error("Error updating dream:", error);
            Alert.alert("Error", "Failed to update dream. Please try again.");
        }
    };

    const submitDream = async () => {
        validation();

        const updatedDream = {
            ...dream,
            wish,
            desc,
            date,
            budget,
            inprogress: false,
            done: true,
        };
    
        try {
            const existingDreams = await AsyncStorage.getItem('dreams');
            let dreamsArray = existingDreams ? JSON.parse(existingDreams) : [];
    
            dreamsArray = dreamsArray.map((item) => 
                item.id === dream.id ? updatedDream : item
            );
    
            await AsyncStorage.setItem('dreams', JSON.stringify(dreamsArray));
            Alert.alert("Success", "Dream updated successfully!");
    
            navigation.goBack();
        } catch (error) {
            console.error("Error updating dream:", error);
            Alert.alert("Error", "Failed to update dream. Please try again.");
        }
    };
    
    return (
        <ImageBackground source={require('../assets/back/back.png')} style={{flex:1}}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack('')}>
                    <Icons type={'back'} />
                </TouchableOpacity>

                <Text style={styles.title}>Garden Dream</Text>

                <ScrollView style={{width: '100%'}}>

                    <TextInput
                        value={wish}
                        placeholder='Your wish'
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        onChangeText={(w) => setWish(w)}
                        style={styles.input}
                    />
                    {wishError ? <Text style={styles.error}>{wishError}</Text> : null}

                    <TextInput
                        value={desc}
                        placeholder='Description'
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        onChangeText={(d) => setDesc(d)}
                        multiline={true}
                        style={[styles.input, {height: 100}]}
                    />
                    {descError ? <Text style={styles.error}>{descError}</Text> : null}

                    <View style={{width: '100%'}}>
                        <TextInput
                            value={date}
                            placeholder='Date'
                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                            style={[styles.input, {paddingLeft: 44}]}
                            editable={false}
                        />
                        <TouchableOpacity style={styles.calendarIcon} onPress={() => setCalendar(true)}>
                            <Icons type={'calendar'} />
                        </TouchableOpacity>
                    </View>
                    {dateError ? <Text style={styles.error}>{dateError}</Text> : null}

                    {
                        calendar && (
                            <Calendar
                                style={{ width: width * 0.89, borderRadius: 12, marginBottom: 10 }}
                                onDayPress={handleDayPress}
                                markedDates={{
                                    [date]: { selected: true, selectedColor: '#ff0004' },
                                }}
                                theme={{
                                    selectedDayBackgroundColor: '#ff0004',
                                    todayTextColor: '#ff0004',
                                    arrowColor: '#ff0004',
                                    textDayFontWeight: '500',
                                    textMonthFontWeight: 'bold',
                                    textDayHeaderFontWeight: '500',
                                }}
                            />
                        )
                    }
                    <TextInput
                        value={budget ? `${budget} $` : ''}
                        placeholder='Planned budget'
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        onChangeText={(b) => {
                            const numericValue = b.replace(/[^0-9]/g, '');
                            setBudget(numericValue);
                        }}
                        style={styles.input}
                    />
                    {budgetError ? <Text style={styles.error}>{budgetError}</Text> : null}

                    <View style={{height: 200}} />
                </ScrollView>

                <TouchableOpacity style={[styles.doneBtn, {backgroundColor: '#0080ff', bottom: height * 0.15}, !isValid && {backgroundColor: '#2b2b2b'}]} onPress={editDream}>
                    <View style={[styles.doneIcon, {marginRight: 6}]}>
                        <Icons type={'edit'} />
                    </View>
                    <Text style={styles.doneBtnText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.doneBtn, !isValid && {backgroundColor: '#2b2b2b'}]} onPress={submitDream}>
                    <View style={styles.doneIcon}>
                        <Icons type={'done'} />
                    </View>
                    <Text style={styles.doneBtnText}>Done</Text>
                </TouchableOpacity>

            </View>
        </ImageBackground>
    )
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
        paddingTop: height * 0.07,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginBottom: height * 0.03
    },

    back: {
        width: 23,
        height: 33,
        position: 'absolute',
        top: height * 0.065,
        left: 20
    },

    doneBtn: {
        position: 'absolute',
        bottom: height * 0.05,
        width: '100%',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#ff0004',
        padding: 16
    },

    doneIcon: {
        width: 24,
        height: 24,
        marginRight: 5
    },

    doneBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff'
    },

    calendarIcon: {
        width: 24,
        height: 24,
        position: 'absolute',
        top: 14,
        left: 10
    },

    input: {
        width: '100%',
        paddingVertical: 17,
        paddingHorizontal: 10,
        backgroundColor: '#2b2b2b',
        borderRadius: 12,
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 10,
        textAlignVertical: 'top'
    },

    error: {
        color: '#ff0004',
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 10,
    },

});

export default DreamDetails;