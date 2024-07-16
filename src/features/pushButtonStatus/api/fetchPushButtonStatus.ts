export async function fetchPushButtonStatus(assetId: string) {
    const response = await fetch(`/api/pushButtonStatus?assetId=${assetId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }
  