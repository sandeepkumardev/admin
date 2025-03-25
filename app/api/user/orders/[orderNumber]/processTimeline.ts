import { formatStatusLabel } from "@/lib/utils";

const processTimeline = (timeline: any[], paymentMode: string, paymentId: string | null) => {
  // Check if any item has status PAYMENT_PENDING or PAYMENT_FAILED and is completed or current
  const hasPaymentIssue = timeline.some(
    (item) => (item.status === "PAYMENT_PENDING" || item.status === "PAYMENT_FAILED") && (item.completed || item.current)
  );

  // Check if order is cancelled
  const isCancelled = timeline.some((item) => item.status === "CANCELLED" && (item.completed || item.current));

  // Check if order is returned or has return issues
  const hasReturnIssue = timeline.some(
    (item) =>
      ["RETURN_REQUESTED", "RETURNED", "RETURN_FAILED", "RETURN_CANCELLED"].includes(item.status) &&
      (item.completed || item.current)
  );

  // Define the standard flow statuses we want to show
  const standardFlow = ["ORDER_CREATED", "CONFIRMED", "SHIPPED", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED"];

  let filteredTimeline = [];

  // Handle payment issues (only if not CASH_ON_DELIVERY)
  if (hasPaymentIssue && paymentMode !== "CASH_ON_DELIVERY" && !paymentId) {
    // For payment issues, only show ORDER_CREATED and the payment issue
    const paymentFailedStatus = timeline.find((item) => item.status === "PAYMENT_FAILED");
    const paymentPendingStatus = timeline.find((item) => item.status === "PAYMENT_PENDING");

    // Add ORDER_CREATED
    const orderCreated = timeline.find((item) => item.status === "ORDER_CREATED") || {
      status: "ORDER_CREATED",
      completed: true,
    };

    filteredTimeline = [orderCreated];

    // Add the payment issue status
    if (paymentFailedStatus) {
      filteredTimeline.push(paymentFailedStatus);
    } else if (paymentPendingStatus) {
      filteredTimeline.push(paymentPendingStatus);
    }
  }
  // Handle cancelled orders
  else if (isCancelled) {
    // Get all completed statuses up to cancellation
    const completedStatuses = timeline
      .filter((item) => item.completed && item.status !== "CANCELLED")
      .sort((a, b) => standardFlow.indexOf(a.status) - standardFlow.indexOf(b.status));

    // Add the CANCELLED status
    const cancelledStatus = timeline.find((item) => item.status === "CANCELLED") || {
      status: "CANCELLED",
      completed: true,
    };

    filteredTimeline = [...completedStatuses, cancelledStatus];
  }
  // Handle return flow
  else if (hasReturnIssue) {
    // First add the standard flow up to DELIVERED
    const standardStatuses = timeline
      .filter((item) => standardFlow.includes(item.status))
      .sort((a, b) => standardFlow.indexOf(a.status) - standardFlow.indexOf(b.status));

    // Then add the return statuses
    const returnStatuses = timeline
      .filter(
        (item) =>
          ["RETURN_REQUESTED", "RETURNED", "RETURN_FAILED", "RETURN_CANCELLED", "REFUNDED"].includes(item.status) &&
          (item.completed || item.current)
      )
      .sort((a, b) => {
        const returnFlow = ["RETURN_REQUESTED", "RETURNED", "REFUNDED", "RETURN_FAILED", "RETURN_CANCELLED"];
        return returnFlow.indexOf(a.status) - returnFlow.indexOf(b.status);
      });

    filteredTimeline = [...standardStatuses, ...returnStatuses];
  }
  // Standard delivery flow
  else {
    filteredTimeline = timeline
      .filter((item) => standardFlow.includes(item.status))
      .sort((a, b) => standardFlow.indexOf(a.status) - standardFlow.indexOf(b.status));
  }

  // First, remove any existing current flags
  filteredTimeline = filteredTimeline.map((item) => ({
    ...item,
    current: false,
  }));

  // Find the last completed status and mark the next one as current
  if (filteredTimeline.length > 0) {
    const completedStatuses = filteredTimeline.filter((item) => item.completed);

    if (completedStatuses.length > 0 && completedStatuses.length < filteredTimeline.length) {
      // Find the index of the last completed status
      const lastCompletedIndex = filteredTimeline.findIndex(
        (item) => item.status === completedStatuses[completedStatuses.length - 1].status
      );

      // If there's a next status after the last completed one, mark it as current
      if (lastCompletedIndex !== -1 && lastCompletedIndex < filteredTimeline.length - 1) {
        filteredTimeline[lastCompletedIndex + 1] = {
          ...filteredTimeline[lastCompletedIndex + 1],
          current: true,
        };
      }
    } else if (completedStatuses.length === 0 && filteredTimeline.length > 0) {
      // If no status is completed, mark the first one as current
      filteredTimeline[0] = {
        ...filteredTimeline[0],
        current: true,
      };
    }
    // If all statuses are completed, don't mark any as current
  }

  // Format the status labels for display
  return filteredTimeline.map((item) => ({
    ...item,
    displayStatus: formatStatusLabel(item.status),
  }));
};

export default processTimeline;
