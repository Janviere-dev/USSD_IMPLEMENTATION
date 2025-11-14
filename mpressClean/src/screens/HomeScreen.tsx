import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../api/config';

export default function HomeScreen({ navigation }: any) {
  const { user, isLoading } = useAuth();
  const [balance, setBalance] = useState('RWF ---');
  const [monthSpent, setMonthSpent] = useState('RWF ---');

  useEffect(() => {
    // Placeholder for fetching balance from backend or SMS
    // In production, integrate with SMS reading or bank API
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brandLabel}>m-press</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.welcome}>
          <Text style={styles.welcomeText}>MoMo Press</Text>
          <Text style={styles.subtitle}>Welcome back, {user?.name || 'User'}!</Text>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>{balance}</Text>
          <Text style={styles.monthLabel}>This Month (Last 7 Days)</Text>
          <Text style={styles.monthAmount}>{monthSpent}</Text>
          <TouchableOpacity style={styles.mtnButton} onPress={() => navigation.navigate('Send')}>
            <Text style={styles.mtnButtonText}>Send Money</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Send')}>
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionLabel}>Send Money</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionIcon}>💳</Text>
            <Text style={styles.actionLabel}>Cash Out</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionIcon}>📱</Text>
            <Text style={styles.actionLabel}>Buy Airtime</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f5f5f5',
  },
  brandLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD600',
  },
  settingsIcon: {
    fontSize: 24,
  },
  content: {
    padding: 20,
  },
  welcome: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  balanceCard: {
    backgroundColor: '#FFD600',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#333',
    opacity: 0.7,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 8,
  },
  monthLabel: {
    fontSize: 12,
    color: '#333',
    opacity: 0.7,
    marginTop: 12,
  },
  monthAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 4,
  },
  mtnButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  mtnButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
});
