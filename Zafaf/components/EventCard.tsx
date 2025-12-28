import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Event } from "../types/Event";
import { likeEvent } from "../api/events";
import { saveEventToCalendar, removeEventFromCalendar } from "../api/calendar";

interface EventCardProps {
  event: Event;
  isFromCalendar?: boolean;
  onRemove?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  isFromCalendar = false,
  onRemove,
}) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(isFromCalendar);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    try {
      setLoading(true);
      await likeEvent(event._id);
      setLiked(!liked);
    } catch (error) {
      Alert.alert("Error", "Failed to like event");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToCalendar = async () => {
    try {
      setLoading(true);
      if (saved) {
        await removeEventFromCalendar(event._id);
        setSaved(false);
        if (onRemove) onRemove();
      } else {
        await saveEventToCalendar(event._id);
        setSaved(true);
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to save event"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      {event.image && (
        <Image source={{ uri: event.image }} style={styles.image} />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.category}>{event.category}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {event.description}
        </Text>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="calendar" size={16} color="#666" />
            <Text style={styles.detailText}>
              {new Date(event.date).toDateString()}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="clock" size={16} color="#666" />
            <Text style={styles.detailText}>{event.time}</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
            <Text style={styles.detailText}>{event.location}</Text>
          </View>
        </View>

        <View style={styles.creator}>
          <Text style={styles.creatorText}>
            By {event.createdBy?.firstName} {event.createdBy?.lastName}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleLike}
            disabled={loading}
          >
            <MaterialCommunityIcons
              name={liked ? "heart" : "heart-outline"}
              size={20}
              color={liked ? "#FF3B30" : "#666"}
            />
            <Text style={styles.actionText}>Like</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSaveToCalendar}
            disabled={loading}
          >
            <MaterialCommunityIcons
              name={saved ? "calendar-check" : "calendar-plus"}
              size={20}
              color={saved ? "#007AFF" : "#666"}
            />
            <Text style={styles.actionText}>
              {saved ? (isFromCalendar ? "Remove" : "Saved") : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 10,
    marginVertical: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 200,
    backgroundColor: "#f0f0f0",
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  category: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  details: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 8,
  },
  creator: {
    marginBottom: 12,
  },
  creatorText: {
    fontSize: 12,
    color: "#999",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  actionText: {
    marginLeft: 8,
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
});

export default EventCard;
