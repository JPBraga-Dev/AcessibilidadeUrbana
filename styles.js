import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  header: {
    backgroundColor: "#1F9D55",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },

  content: {
    padding: 16,
    paddingBottom: 100,
  },

  searchContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#1F9D55",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    height: 40,
    marginLeft: 8,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 10,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },

  filterButton: {
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  activeButton: {
    backgroundColor: "#1F9D55",
    borderColor: "#1F9D55",
  },

  filterText: {
    color: "#666",
    fontSize: 13,
  },

  activeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  applyButton: {
    backgroundColor: "#1F9D55",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },

  applyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },

  bottomNav: {
    height: 70,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#DDD",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },

  navItem: {
    alignItems: "center",
  },

  navText: {
    fontSize: 11,
    color: "#999",
    marginTop: 3,
  },
});

export default styles;