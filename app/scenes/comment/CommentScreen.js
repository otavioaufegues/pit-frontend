import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { getMessages, sendMessage } from '../../services/user';
import { useAsync } from '../../hooks/useAsync';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Loading from '../rit/Loading';
import { useAuth } from '../../providers/auth';
import moment from 'moment';

const Comment = ({ route, navigation }) => {
  const { state, handleLogout } = useAuth();
  const user = state.user;
  const { year } = route.params;
  const { execute, response, status, error } = useAsync(() =>
    getMessages(year._id),
  );
  const [messageText, setMessageText] = useState('');

  const handleSend = () => {
    // sendMessage(year._id, messageText);
    // setMessageText('');
  };

  const renderMessages = (message, index) => {
    return (
      <View key={index} style={styles.messageContainer}>
        <Text style={styles.messageText}>{message.content}</Text>
        <Text style={styles.messageAuthor}>
          {message.sender._id === user._id ? 'Eu' : message.sender.firstName}
        </Text>
        <Text style={styles.messageTimestamp}>
          {moment.utc(message.timestamp).format('DD/MM/YYYY')}
        </Text>
      </View>
    );
  };

  useEffect(() => {
    console.log(error);
  }, [status]);

  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView style={styles.container}>
        <ScrollView style={styles.messagesContainer}>
          {status === 'pending' && <Loading />}
          {status === 'success' && response.data.messages.map(renderMessages)}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Digite uma mensagem"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  messagesContainer: {
    flex: 1,
  },
  messageContainer: {
    marginBottom: 12,
  },
  messageText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  messageAuthor: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 2,
  },
  messageTimestamp: {
    fontSize: 12,
    color: 'lightgray',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: 'blue',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Comment;
